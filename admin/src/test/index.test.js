const chai = require("chai")
const chaiHttp = require("chai-http")
const expect = chai.expect

const app = require("../index")
const {
  objArrToCsvText,
  parseInvestments,
} = require("../services/investment")

chai.use(chaiHttp)

let retrievedInvestments
let investmentId

before(() => {
  investmentId = "1"
})

describe("/GET investments", () => {
  it("Should get all investments", (done) => {
    chai
      .request(app)
      .get("/investments")
      .end((_err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body).to.be.an("array")
        expect(res.body[0]).to.haveOwnProperty("id")
        expect(res.body[0]).to.haveOwnProperty("userId")
        expect(res.body[0]).to.haveOwnProperty("firstName")
        expect(res.body[0]).to.haveOwnProperty("lastName")
        expect(res.body[0]).to.haveOwnProperty("investmentTotal")
        expect(res.body[0]).to.haveOwnProperty("date")
        expect(res.body[0]).to.haveOwnProperty("holdings")

        retrievedInvestments = res.body
        done()
      })
  })
})

describe("Parse investment data", () => {
  it("Should parse the data into a new object", (done) => {
    parseInvestments(retrievedInvestments[0])
      .then((parsedInvestment) => {
        expect(parsedInvestment).to.be.an("array")
        expect(parsedInvestment[0]).to.haveOwnProperty("User")
        expect(parsedInvestment[0]).to.haveOwnProperty("First Name")
        expect(parsedInvestment[0]).to.haveOwnProperty("Last Name")
        expect(parsedInvestment[0]).to.haveOwnProperty("Date")
        expect(parsedInvestment[0]).to.haveOwnProperty("Holding")
        expect(parsedInvestment[0]).to.haveOwnProperty("Value")
        done()
      })
      .catch((err) => done(err))
  })
})

describe("CSV Text", () => {
  it("Should convert object array to csv text", (done) => {
    objArrToCsvText(retrievedInvestments)
      .then((csvText) => {
        expect(csvText).to.be.an("string")
        expect(csvText).to.include("\n")
        done()
      })
      .catch((err) => done(err))
  })
})

describe("/GET/investments/:id/export", () => {
  it("Should export specific investment as csv text", (done) => {
    chai
      .request(app)
      .get(`/investments/${investmentId}/export`)
      .end((_err, res) => {
        expect(res.status).to.equal(200)
        expect(res.text).to.equal("Exported CSV Text succesfully")
        done()
      })
  })
})

describe("/GET/investments/export", () => {
  it("Should export all investments as csv text", (done) => {
    chai
      .request(app)
      .get(`/investments/${investmentId}/export`)
      .end((_err, res) => {
        expect(res.status).to.equal(200)
        expect(res.text).to.equal("Exported CSV Text succesfully")
        done()
      })
  })
})
