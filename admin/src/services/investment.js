// Package "request" was deprecated, prefered "axios" instead
const axios = require("axios")
const R = require("ramda")
const config = require("config")

const csvHeaderKeys = {
  user: "User",
  firstName: "First Name",
  lastName: "Last Name",
  date: "Date",
  holding: "Holding",
  value: "Value",
}

const getInvestmentData = async (id = null) => {
  const url = id
    ? `${config.investmentsServiceUrl}/investments/${id}`
    : `${config.investmentsServiceUrl}/investments`

  try {
    const {data: investmentData} = await axios.get(url)
    if (R.isEmpty(investmentData)) {
      throw new Error("Investment does not exist")
    }
    return investmentData
  } catch (error) {
    throw new Error(error.message)
  }
}

const getCompanyById = async (id) => {
  const url = `${config.companiesServiceUrl}/companies/${id}`
  try {
    const {data: company} = await axios.get(url)
    if (!company) {
      throw new Error("Company does not exist")
    }
    return company
  } catch (error) {
    throw new Error(error)
  }
}

const parseInvestments = async (investment) => {
  const {userId, firstName, lastName, date, holdings, investmentTotal} =
    investment
  const parsedInvestments = []
  // Creating parsed object for each holding to create rows for csv text.
  await Promise.all(
    holdings.map(async (holding, i) => {
      const company = await getCompanyById(holdings[i].id)
      const {investmentPercentage} = holding
      const {name: companyName} = company
      // Date can be arranged more properly
      // For example: dd/mm/yyyy instead of yyyy-mm-dd
      const parsedInvestment = {
        [csvHeaderKeys.user]: userId,
        [csvHeaderKeys.firstName]: firstName,
        [csvHeaderKeys.lastName]: lastName,
        [csvHeaderKeys.date]: date,
        [csvHeaderKeys.holding]: companyName,
        [csvHeaderKeys.value]: investmentTotal * investmentPercentage,
      }
      parsedInvestments.push(parsedInvestment)
    }),
  )
  return parsedInvestments
}

// I could've used a npm package for this function instead
// Most of the time i try to avoid depending on other packages
const objArrToCsvText = async (investments) => {
  // Mapping through all investment data to parse if retrieved more than one.
  // For example: /investments/export retrieves all of the investments.
  const parsedInvestments = await Promise.all(
    investments.map((investment) => {
      return parseInvestments(investment)
    }),
  )
  let csvBody = ""
  parsedInvestments.forEach((investment) => {
    csvBody += `${investment
      .map((value) => R.values(value).join(","))
      .join("\n")}\n`
  })
  // Grabbing the keys of the first object in the array for CSV Header
  // since all the keys are the same for all parsed investment objects.
  const csvHeaders = R.keys(parsedInvestments[0][0]).join(",").concat("\n")
  const csvText = csvHeaders.concat(csvBody)
  return csvText
}

const exportDataAsCsvText = async (id = null) => {
  try {
    const investments = await getInvestmentData(id)
    const csvText = await objArrToCsvText(investments)
    const url = `${config.investmentsServiceUrl}/investments/export`
    await axios.post(url, {
      data: csvText,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = {exportDataAsCsvText, getInvestmentData, parseInvestments, objArrToCsvText}
