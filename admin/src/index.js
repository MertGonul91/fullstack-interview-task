const express = require("express")
const bodyParser = require("body-parser")
const config = require("config")
const {
  getInvestmentData,
  exportDataAsCsvText,
} = require("./services/investment")

const app = express()

app.use(bodyParser.json({limit: "10mb"}))

// Export all the investments as CSV Text
app.get("/investments/export", async (_req, res) => {
  try {
    await exportDataAsCsvText()
    res.status(200).send("Exported CSV Text succesfully")
  } catch (error) {
    res.status(500).send(error.message)
  }
})

// Export investment as CSV Text
app.get("/investments/:id/export", async (req, res) => {
  const {id} = req.params
  try {
    await exportDataAsCsvText(id)
    res.status(200).send("Exported CSV Text succesfully")
  } catch (error) {
    res.status(500).send(error.message)
  }
})

// Get all the investments
app.get("/investments", async (_req, res) => {
  try {
    const investments = await getInvestmentData()
    res.status(200).send(investments)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

app.get("/investments/:id", async (req, res) => {
  const {id} = req.params
  try {
    const investment = await getInvestmentData(id)
    res.status(200).send(investment)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

if (!module.parent) {
  app.listen(config.port, (err) => {
    if (err) {
      console.error("Error occurred starting the server", err)
      process.exit(1)
    }
    console.log(`Server running on port ${config.port}`)
  })
}

module.exports = app
