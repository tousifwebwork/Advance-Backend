require('dotenv').config();

const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");


const app = express();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//Without Langchain
// app.post('/generate', async (req, res) => {
//   const { prompt } = req.body;

//   try {
//     const response = await ai.models.generateContent({
//       model: 'gemini-2.5-flash',

//       contents: [
//         {
//           role: 'user',
//           parts: [
//             {
//               text: `Explain in one line in short: ${prompt}`
//             }
//           ]
//         }
//       ],

//       config: {
//         systemInstruction:
//           'You are an AI assistant and your name is Jaris. If you are unable/ dont know how to answer a question, please respond with "I am not sure about that."',
//       }
//     });

//     res.json({
//       text: response.text
//     });

//   } catch (error) {
//     console.error('Gemini Error:', error);

//     res.status(500).json({
//       error: 'An error occurred while generating content.'
//     });
//   }
// });






//With Langchain
const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.5, 
})

app.post('/generate', async (req, res) => {
    const { prompt } = req.body;
    const response = await llm.invoke([
        {
            role: "system",
            content: 'You are an AI assistant and your name is Jaris. If you are unable/ dont know how to answer a question, please respond with "I am not sure about that."'
        },
        {
            role: "human",
            content: prompt
        }
    ]);
    res.json({text: response.content})
})





app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});