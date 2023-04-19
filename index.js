const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a23wjbh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const applicationData = client
      .db("applicationForm")
      .collection("applicantData");
    const pdfData = client.db("applicationForm").collection("Pdf");

    app.post("/applicationData", async (req, res) => {
      const data = req.body;
      const result = await applicationData.insertOne(data);
      const { email } = data;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ferne46@ethereal.email",
          pass: "JvmHad27Yn7VRGaes2",
        },
      });
      const mailOptions = {
        from: "tanjirtuhin18@gmail.com",
        to: { email },
        subject: "Application Feedback",
        text: `Name: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      res.send(result);
    });
  } catch (err) {
    console.error(err);
  } finally {
  }
}
run().catch(console.dir);

// Routes
app.get("/", (req, res) => {
  res.send("application surver is running");
});

app.listen(port, () =>
  console.log(`application form is running on port ${port}`)
);
