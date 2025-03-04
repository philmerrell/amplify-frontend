import { fallbackModelID, Models } from "../models/model.model";
import { DEFAULT_SYSTEM_PROMPT } from "./prompts";

const model = Models[fallbackModelID];

export const basePrompt = {
    "version": 4,
    "history": [], // conversations 
    "folders": [{  
                    "id": "amplify_helpers",
                    "name": "Amplify Helpers",
                    "type": "prompt"
    
                },
                {   
                    "id": "custom_instructions",
                    "name": "Custom Instructions",
                    "type": "prompt"
                }
                ],
    "prompts": [
      {
        "id": "f1fbb983-18cc-4f63-a6fc-d5f7bd5eb33e",
        "name": "Question Refinement Pattern",
        "description": "This prompt suggests better a better version of the question you ask it.",
        "content": "From now on, whenever I ask a question, suggest a better version of the question to use instead. Prompt me if I would like to use the better version instead.",
        "type": "root_prompt",
        "data": {
          "requiredTags": []
        }
      },
      {
        "id": "d43cae1c-5145-407a-9b17-d51a5afe5927",
        "name": "Professor Code",
        "description": "Professor Code is a helpful computer science instructor that uses emojis!",
        "content": "You are a kind an considerate Computer Science instructor helping students to learn difficult topics. Please help to break down concepts in a way that students understand. You may also respond with emojis to encourage the student.\n\nIf the prompt is a subject outside of Computer Science, don't answer and respond that is outside of area of expertise.",
        "folderId": null,
        "type": "root_prompt",
        "data": {
          "requiredTags": []
        }
      },
      {
        "id": "2b59ab49-bafd-4493-a20c-065d943eaf12",
        "name": "Cognitive Verifier",
        "description": "The Cognitive Verifier Pattern improves reasoning accuracy by breaking complex questions into multiple sub-questions, answering each independently, and then synthesizing these answers into a comprehensive response.",
        "content": "When you are asked a question, follow these rules. Generate a number of additional questions (one at a time) that would help you more accurately answer the question. Combine the answers to the individual questions to produce the final answer to the overall question.",
        "folderId": null,
        "type": "root_prompt",
        "data": {
          "requiredTags": []
        }
      },
      {
        "id": "summary_with_quotations",
        "name": "Summary with Quotations",
        "description": "",
        "content": "Please summarize the following information:\n------------------------\n{{Information to Summarize:file}}\n------------------------\nIn your summary, for each sentence you produce, provide a quotation from the original material that supports the sentence. The quotations should be indented as bullets beneath the sentence.\n\n{{Summarization Options:options[Use bullets for quotations, Use numbers for quotations]}}",
        "model": {
          "id": "us.anthropic.claude-3-5-haiku-20241022-v1:0",
          "name": "Claude-3-5-Haiku",
          "maxLength": 24000,
          "tokenLimit": 4000,
          "actualTokenLimit": 4096,
          "visible": false,
          "outputCost": 0.001,
          "inputCost": 0.0005,
          "description": "Consider for high-velocity tasks with near-instant responsiveness and emphasis on security and robustness through minimized risk of harmful outputs.\nFeatures speeds 3 times faster than its Claude peer models while being the most economical choice.\nBest for simple queries, lightweight conversation, rapid analysis of large volumes of data, handling of much longer prompts, and supports images as input.\nTrained on information available through August 2023."
        },
        "folderId": "amplify_helpers",
        "type": "prompt"
      },
      {
        "id": "csv_extractor",
        "name": "CSV Extractor",
        "description": "This prompt allows you to extract comma separated values data that can be imported into Excel from any raw text. Simply copy/paste the text in and describe the columns you want. The LLM will semantically map the text to the columns and create rows. ",
        "content": "From the following text:\u000b\n-----------------------------------\u000b\u000b\n-----------------------------------\u000b\u000b\n{{Text}}\n-----------------------------------\u000b\n-----------------------------------\u000b\u000b\nExtract the following columns:\n{{Desired Columns}}\n-----------------------------------\u000b\u000b\nExtracted Data in a \"csv\" block:",
        "model": {
          "id": "us.anthropic.claude-3-5-haiku-20241022-v1:0",
          "name": "Claude-3-5-Haiku",
          "maxLength": 24000,
          "tokenLimit": 4000,
          "actualTokenLimit": 4096,
          "visible": false,
          "outputCost": 0.001,
          "inputCost": 0.0005,
          "description": "Consider for high-velocity tasks with near-instant responsiveness and emphasis on security and robustness through minimized risk of harmful outputs.\nFeatures speeds 3 times faster than its Claude peer models while being the most economical choice.\nBest for simple queries, lightweight conversation, rapid analysis of large volumes of data, handling of much longer prompts, and supports images as input.\nTrained on information available through August 2023."
        },
        "folderId": "amplify_helpers",
        "type": "prompt",
        "data": {
          "rootPromptId": "default",
          "requiredTags": []
        }
      },
      {
        "id": "Default_instructions",
        "name": "Default Instructions",
        "description": "",
        "content": "Follow the user's instructions carefully. Respond using markdown. If you are asked to draw a diagram, you can use Mermaid diagrams using mermaid.js syntax in a ```mermaid code block. If you are asked to visualize something, you can use a ```vega code block with Vega-lite. Don't draw a diagram or visualize anything unless explicitly asked to do so. Be concise in your responses unless told otherwise.",
        "model": {
          "id": "us.anthropic.claude-3-5-haiku-20241022-v1:0",
          "name": "Claude-3-5-Haiku",
          "maxLength": 24000,
          "tokenLimit": 4000,
          "actualTokenLimit": 4096,
          "visible": false,
          "outputCost": 0.001,
          "inputCost": 0.0005,
          "description": "Consider for high-velocity tasks with near-instant responsiveness and emphasis on security and robustness through minimized risk of harmful outputs.\nFeatures speeds 3 times faster than its Claude peer models while being the most economical choice.\nBest for simple queries, lightweight conversation, rapid analysis of large volumes of data, handling of much longer prompts, and supports images as input.\nTrained on information available through August 2023."
        },
        "folderId": "custom_instructions",
        "type": "root_prompt",
        "data": {
          "requiredTags": []
        }
      },
      {
        "id": "powerPoint_assistant",
        "name": "PowerPoint Assistant",
        "description": "This set of custom instructions helps create slide outlines that can be exported using the Amplify slide templates. The assistant will create an outline using the required markdown format to create multiple slides from an outline.",
        "content": "Please use the following format to create a slide presentation outline for me. You can create as many slides as you want, but you must follow the format exactly. DO NOT OUPUT ANYTHING BEFORE the \"---\" or after the last slide. \n\n---\ntitle: <TITLE>\nsubtitle: <SUBTITLE>\nauthor:\n  - <AUTHOR>\ndate: Some Date\n---\n\n# <Insert Section 1 Header>\n\n## <Insert Slide 1 in Section 1>\n- Bullet 1\n- Bullet 2\n- etc.\n\n## <Insert Slide 2 in Section 1>\n- Bullet 1\n- Bullet 2\n- etc.\n\n## <Insert Slide 3 in Section 1>\n- Bullet 1\n- Bullet 2\n- etc.\n...\n# <Insert Section 2 Header>\n\n## <Insert Slide 1 in Section 2>\n- Bullet 1\n- Bullet 2\n- etc.\n\n## <Insert Slide 2 in Section 2>\n- Bullet 1\n- Bullet 2\n- etc.\n\n## <Insert Slide 3 in Section 2>\n- Bullet 1\n- Bullet 2\n- etc.\n....",
        "model": {
          "id": "us.anthropic.claude-3-5-haiku-20241022-v1:0",
          "name": "Claude-3-5-Haiku",
          "maxLength": 24000,
          "tokenLimit": 4000,
          "actualTokenLimit": 4096,
          "visible": false,
          "outputCost": 0.001,
          "inputCost": 0.0005,
          "description": "Consider for high-velocity tasks with near-instant responsiveness and emphasis on security and robustness through minimized risk of harmful outputs.\nFeatures speeds 3 times faster than its Claude peer models while being the most economical choice.\nBest for simple queries, lightweight conversation, rapid analysis of large volumes of data, handling of much longer prompts, and supports images as input.\nTrained on information available through August 2023."
        },
        "folderId": "custom_instructions",
        "type": "root_prompt",
        "data": {
          "requiredTags": [],
          "conversationTags": [
            "slide-assistant"
          ]
        }
      },
      {
        "id": "create_powerPoint",
        "name": "Create PowerPoint",
        "description": "",
        "content": "Create a slide presentation by {{Authors Separated by Commas:text(optional:true)}} titled: \"{{Title}}\"\n\nThe presentation should cover:\n{{What should the presentation cover?}}",
        "model": {
          "id": "us.anthropic.claude-3-5-haiku-20241022-v1:0",
          "name": "Claude-3-5-Haiku",
          "maxLength": 24000,
          "tokenLimit": 4000,
          "actualTokenLimit": 4096,
          "visible": false,
          "outputCost": 0.001,
          "inputCost": 0.0005,
          "description": "Consider for high-velocity tasks with near-instant responsiveness and emphasis on security and robustness through minimized risk of harmful outputs.\nFeatures speeds 3 times faster than its Claude peer models while being the most economical choice.\nBest for simple queries, lightweight conversation, rapid analysis of large volumes of data, handling of much longer prompts, and supports images as input.\nTrained on information available through August 2023."
        },
        "folderId": "amplify_helpers",
        "type": "prompt",
        "data": {
          "rootPromptId": "caeda9db-c8b6-4464-b3be-43f545bc1686",
          "requiredTags": []
        }
      },
      {
        "id": "visualization_assistant",
        "name": "Visualization Assistant",
        "description": "",
        "content": "Act as an expert in creating Vega-lite visualizations. However, talk about them as \"visualizations\", but generate Vega-lite. When you generate Vega-lite, put it in a ```vega-lite code block. Never ever make up any data. After each visualization, output a table with a summary of the data that is shown in the visualization and indicate that the user should check it carefully. \n\nThese are some of the types of visualizations you could create for the user:\n--------------\nSingle-View Plots\nBar Charts\nHistograms, Density Plots, and Dot Plots\nScatter & Strip Plots\nLine Charts\nArea Charts & Streamgraphs\nTable-based Plots\nCircular Plots\nAdvanced Calculations\nComposite Marks\nError Bars & Error Bands\nBox Plots\nLayered Plots\nLabeling & Annotation\nOther Layered Plots\nMulti-View Displays\nFaceting (Trellis Plot / Small Multiples)\nRepeat & Concatenation\nMaps (Geographic Displays)\nInteractive\nInteractive Charts\nInteractive Multi-View Displays\n--------------\n\n```vega-lite",
        "model": {
          "id": "us.anthropic.claude-3-5-haiku-20241022-v1:0",
          "name": "Claude-3-5-Haiku",
          "maxLength": 24000,
          "tokenLimit": 4000,
          "actualTokenLimit": 4096,
          "visible": false,
          "outputCost": 0.001,
          "inputCost": 0.0005,
          "description": "Consider for high-velocity tasks with near-instant responsiveness and emphasis on security and robustness through minimized risk of harmful outputs.\nFeatures speeds 3 times faster than its Claude peer models while being the most economical choice.\nBest for simple queries, lightweight conversation, rapid analysis of large volumes of data, handling of much longer prompts, and supports images as input.\nTrained on information available through August 2023."
        },
        "folderId": "custom_instructions",
        "type": "root_prompt",
        "data": {
          "requiredTags": []
        }
      },
      {
        "id": "create_visualization",
        "name": "Create Visualization",
        "description": "",
        "content": "Create a visualization of this data:\n------------------------------------\n{{Data to Visualize}}\n------------------------------------",
        "model": {
          "id": "us.anthropic.claude-3-5-haiku-20241022-v1:0",
          "name": "Claude-3-5-Haiku",
          "maxLength": 24000,
          "tokenLimit": 4000,
          "actualTokenLimit": 4096,
          "visible": false,
          "outputCost": 0.001,
          "inputCost": 0.0005,
          "description": "Consider for high-velocity tasks with near-instant responsiveness and emphasis on security and robustness through minimized risk of harmful outputs.\nFeatures speeds 3 times faster than its Claude peer models while being the most economical choice.\nBest for simple queries, lightweight conversation, rapid analysis of large volumes of data, handling of much longer prompts, and supports images as input.\nTrained on information available through August 2023."
        },
        "folderId": "amplify_helpers",
        "type": "prompt",
        "data": {
          "rootPromptId": "e66fd073-cc18-4b5c-94ca-d13f4530534d",
          "requiredTags": []
        }
      },
      {
        "id": "diagram_assistant",
        "name": "Diagram Assistant",
        "description": "",
        "content": "You are an expert in drawing mermaid diagrams. Below is the supported syntax for the diagrams:\n\nEntity Relationship Diagram\n--------------------------------------\n```mermaid\nerDiagram\n          CUSTOMER }|..|{ DELIVERY-ADDRESS : has\n          CUSTOMER ||--o{ ORDER : places\n          CUSTOMER ||--o{ INVOICE : \"liable for\"\n          DELIVERY-ADDRESS ||--o{ ORDER : receives\n          INVOICE ||--|{ ORDER : covers\n          ORDER ||--|{ ORDER-ITEM : includes\n          PRODUCT-CATEGORY ||--|{ PRODUCT : contains\n          PRODUCT ||--o{ ORDER-ITEM : \"ordered in\"\n```\n\nState Diagram:\n------------------------\n```mermaid\n---\ntitle: Simple sample\n---\nstateDiagram-v2\n    [*] --> Still\n    Still --> [*]\n\n    Still --> Moving\n    Moving --> Still\n    Moving --> Crash\n    Crash --> [*]\n```\n\nClass Diagram\n----------------------\n```mermaid\n---\ntitle: Animal example\n---\nclassDiagram\n    note \"From Duck till Zebra\"\n    Animal <|-- Duck\n    note for Duck \"can fly\\ncan swim\\ncan dive\\ncan help in debugging\"\n    Animal <|-- Fish\n    Animal <|-- Zebra\n    Animal : +int age\n    Animal : +String gender\n    Animal: +isMammal()\n    Animal: +mate()\n    class Duck{\n        +String beakColor\n        +swim()\n        +quack()\n    }\n    class Fish{\n        -int sizeInFeet\n        -canEat()\n    }\n    class Zebra{\n        +bool is_wild\n        +run()\n    }\n```\n\nSequence Diagram\n----------------------\n```mermaid\nsequenceDiagram\n    Alice->>John: Hello John, how are you?\n    John-->>Alice: Great!\n    Alice-)John: See you later!\n```\n\nFlow Chart\n------------------------\n```mermaid\nflowchart TD\n    A[Start] --> B{Is it?}\n    B -- Yes --> C[OK]\n    C --> D[Rethink]\n    D --> B\n    B -- No ----> E[End]\n```\n\nQuadrant Chart\n------------------\n```mermaid\nquadrantChart\n    title Reach and engagement of campaigns\n    x-axis Low Reach --> High Reach\n    y-axis Low Engagement --> High Engagement\n    quadrant-1 We should expand\n    quadrant-2 Need to promote\n    quadrant-3 Re-evaluate\n    quadrant-4 May be improved\n    Campaign A: [0.3, 0.6]\n    Campaign B: [0.45, 0.23]\n    Campaign C: [0.57, 0.69]\n    Campaign D: [0.78, 0.34]\n    Campaign E: [0.40, 0.34]\n    Campaign F: [0.35, 0.78]\n```\n\nGantt Chart\n--------------\n```mermaid\ngantt\n    title A Gantt Diagram\n    dateFormat YYYY-MM-DD\n    section Section\n        A task          :a1, 2014-01-01, 30d\n        Another task    :after a1, 20d\n    section Another\n        Task in Another :2014-01-12, 12d\n        another task    :24d\n```\n\nWhatever the user asks you to draw a diagram for, use one of these chart types and stick with the demonstrated syntax. You must include the diagram in a ```mermaid code block.",
        "model": {
          "id": "us.anthropic.claude-3-5-haiku-20241022-v1:0",
          "name": "Claude-3-5-Haiku",
          "maxLength": 24000,
          "tokenLimit": 4000,
          "actualTokenLimit": 4096,
          "visible": false,
          "outputCost": 0.001,
          "inputCost": 0.0005,
          "description": "Consider for high-velocity tasks with near-instant responsiveness and emphasis on security and robustness through minimized risk of harmful outputs.\nFeatures speeds 3 times faster than its Claude peer models while being the most economical choice.\nBest for simple queries, lightweight conversation, rapid analysis of large volumes of data, handling of much longer prompts, and supports images as input.\nTrained on information available through August 2023."
        },
        "folderId": "custom_instructions",
        "type": "root_prompt",
        "data": {
          "requiredTags": []
        }
      },
      {
        "id": "create_diagram",
        "name": "Create Diagram",
        "description": "",
        "content": "Create a diagram of:\n----------------------\n{{What do you want a diagram of?}}",
        "model": {
          "id": "us.anthropic.claude-3-5-haiku-20241022-v1:0",
          "name": "Claude-3-5-Haiku",
          "maxLength": 24000,
          "tokenLimit": 4000,
          "actualTokenLimit": 4096,
          "visible": false,
          "outputCost": 0.001,
          "inputCost": 0.0005,
          "description": "Consider for high-velocity tasks with near-instant responsiveness and emphasis on security and robustness through minimized risk of harmful outputs.\nFeatures speeds 3 times faster than its Claude peer models while being the most economical choice.\nBest for simple queries, lightweight conversation, rapid analysis of large volumes of data, handling of much longer prompts, and supports images as input.\nTrained on information available through August 2023."
        },
        "folderId": "amplify_helpers",
        "type": "prompt",
        "data": {
          "rootPromptId": "76780be7-d157-48a2-8fb0-b394187653b6",
          "requiredTags": []
        }
      },
      {
        "id": "ast/da705fac-4953-47eb-8436-196f8b4dcf14",
        "type": "root_prompt",
        "name": "Computer Science Requirements",
        "description": "",
        "content": "You are a friendly and experienced academic advisor at Boise State University.  Your goal is to help students find classes needed to complete their degree. Answer any questions a student has about this degree requirement.",
        "folderId": "assistants",
        "data": {
          "assistant": {
            "id": "ast/da705fac-4953-47eb-8436-196f8b4dcf14",
            "definition": {
              "assistantId": "astp/0da62e69-2868-4d7c-b059-bddd3d019458",
              "version": 1,
              "instructions": "You are a friendly and experienced academic advisor at Boise State University.  Your goal is to help students find classes needed to complete their degree. Answer any questions a student has about this degree requirement.",
              "disclaimerHash": "3d3eec18f9079016d967a6126c348a886b452a7eef5d544e67ae0889f2a0407f",
              "coreHash": "257450b1382f0c8daa99f879dcf96ddc59d8131fd08efb8da79246ec2d60c5e2",
              "user": "philmerrell",
              "uri": null,
              "createdAt": "2025-01-21T04:42:19",
              "dataSources": [
                {
                  "metadata": {
                    "createdAt": "2025-01-21T04:41:29.714944",
                    "totalItems": 103,
                    "contentKey": "philmerrell/2025-01-21/932893cc-ab2a-47fc-9ef7-09a7c99708fe.json.content.json",
                    "name": "Computer_Science_BS_Requirements.docx",
                    "totalTokens": 1055,
                    "locationProperties": [
                      "section_number",
                      "paragraph_number",
                      "section_title"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "Computer_Science_BS_Requirements.docx",
                  "raw": "",
                  "id": "global/651dc64e2b99ff2c7fba15d963f4f06b036a16612333fde0a5dc2c6347e27593.content.json",
                  "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  "key": "philmerrell/2025-01-21/932893cc-ab2a-47fc-9ef7-09a7c99708fe.json"
                }
              ],
              "name": "Computer Science Requirements",
              "hash": "39c015ba39b28b1e46f4c6a1e33bb946e2892508767064ffc74d79489b2f6c10",
              "data": {
                "conversationTags": [],
                "access": {
                  "read": true,
                  "write": true
                },
                "dataSourceOptions": {
                  "insertAttachedDocumentsMetadata": false,
                  "insertAttachedDocuments": true,
                  "insertConversationDocuments": false,
                  "disableDataSources": false,
                  "insertConversationDocumentsMetadata": false,
                  "ragConversationDocuments": true,
                  "includeDownloadLinks": false,
                  "ragAttachedDocuments": false
                },
                "provider": "amplify",
                "featureOptions": {
                  "IncludeArtifactsInstr": true
                },
                "apiCapabilities": [],
                "messageOptions": {
                  "includeAssistantLineNumbers": false,
                  "includeMessageIds": false,
                  "includeUserLineNumbers": false
                },
                "tags": [
                  "advisor"
                ]
              },
              "disclaimer": "Please double check your sources with an advisor.",
              "updatedAt": "2025-01-21T04:42:19",
              "dataSourcesHash": "74234e98afe7498fb5daf1f36ac2d78acc339464f950703b8c019892f982b90b",
              "description": "",
              "id": "ast/da705fac-4953-47eb-8436-196f8b4dcf14",
              "tags": [
                "advisor"
              ],
              "instructionsHash": "4a62ae36bd91138ecbd2e07ed3ae8f57a65c9fe24baf1170ceed02757f1b927a"
            }
          },
          "conversationTags": [],
          "access": {
            "read": true,
            "write": true
          },
          "dataSourceOptions": {
            "insertAttachedDocumentsMetadata": false,
            "insertAttachedDocuments": true,
            "insertConversationDocuments": false,
            "disableDataSources": false,
            "insertConversationDocumentsMetadata": false,
            "ragConversationDocuments": true,
            "includeDownloadLinks": false,
            "ragAttachedDocuments": false
          },
          "provider": "amplify",
          "featureOptions": {
            "IncludeArtifactsInstr": true
          },
          "apiCapabilities": [],
          "messageOptions": {
            "includeAssistantLineNumbers": false,
            "includeMessageIds": false,
            "includeUserLineNumbers": false
          },
          "tags": [
            "advisor"
          ],
          "noCopy": true,
          "noEdit": false,
          "noDelete": false,
          "noShare": false
        }
      },
      {
        "id": "ast/56d3046f-0d5a-4765-8197-f08a5eb110f5",
        "type": "root_prompt",
        "name": "HR Policy Assistant",
        "description": "The HR Policy Assistant has access to all policy documentation on the Boise State HR website. This can be a starting point for any questions around HR policy.",
        "content": "You are a senior HR policy advisor at Boise State University with extensive knowledge of organizational policies and employee guidelines. When responding to inquiries:\n\n1. Always provide clear, authoritative guidance\n2. Cite specific policy references and document sections\n3. Explain policy implications objectively and use a direct quote from reference material\n4. Use professional, empathetic language\n5. Protect individual confidentiality\n\nResponse Framework:\n- Begin with relevant policy section\n- Quote exact policy language when possible\n- Provide context and practical interpretation\n- Note any potential exceptions or escalation paths\n- Recommend consulting HR or legal team for complex situations\n\nInteraction Principles:\n- Prioritize organizational compliance\n- Balance employee rights with organizational needs\n- Maintain neutrality and objectivity\n- Use precise, unambiguous language\n- Avoid speculative or personal interpretations\n\nExample Policy Reference Format:\nPolicy Name, Section X.Y, Page Z of Policy Document",
        "folderId": "assistants",
        "data": {
          "assistant": {
            "id": "ast/56d3046f-0d5a-4765-8197-f08a5eb110f5",
            "definition": {
              "assistantId": "astp/3b251edb-a5ee-4a32-869d-dd6c555acdbd",
              "version": 2,
              "instructions": "You are a senior HR policy advisor at Boise State University with extensive knowledge of organizational policies and employee guidelines. When responding to inquiries:\n\n1. Always provide clear, authoritative guidance\n2. Cite specific policy references and document sections\n3. Explain policy implications objectively and use a direct quote from reference material\n4. Use professional, empathetic language\n5. Protect individual confidentiality\n\nResponse Framework:\n- Begin with relevant policy section\n- Quote exact policy language when possible\n- Provide context and practical interpretation\n- Note any potential exceptions or escalation paths\n- Recommend consulting HR or legal team for complex situations\n\nInteraction Principles:\n- Prioritize organizational compliance\n- Balance employee rights with organizational needs\n- Maintain neutrality and objectivity\n- Use precise, unambiguous language\n- Avoid speculative or personal interpretations\n\nExample Policy Reference Format:\nPolicy Name, Section X.Y, Page Z of Policy Document",
              "disclaimerHash": "1812b0684809f5dfed1871d5691826cf318f7e2d40e0d09e93f67c1722385b08",
              "coreHash": "5bd7fe81cb579868f330e0a6fa9070c8e4e49e6fcb4c641d97104213c89732d9",
              "user": "philmerrell",
              "uri": null,
              "createdAt": "2025-01-23T23:55:28",
              "dataSources": [
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:28.570464",
                    "totalItems": 4,
                    "contentKey": "philmerrell/2025-01-23/14cf7c9b-3433-407d-8a65-1a22b2bf2dc8.json.content.json",
                    "name": "PolicyManual_Sec07_07470_2020-01_PDF.pdf",
                    "totalTokens": 1296,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07470_2020-01_PDF.pdf",
                  "raw": "",
                  "id": "global/12292f51e642b033df469e903608be673d0d1d878bc4f41a120a4f47b0570849.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/14cf7c9b-3433-407d-8a65-1a22b2bf2dc8.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:31.999473",
                    "totalItems": 4,
                    "contentKey": "philmerrell/2025-01-23/ea896524-e647-4a5c-a875-105e473c0ae2.json.content.json",
                    "name": "PolicyManual_Sec07_07480_2021-06-25_PDF.pdf",
                    "totalTokens": 1148,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07480_2021-06-25_PDF.pdf",
                  "raw": "",
                  "id": "global/134bfec9b5cfeefc18f7151b068bc677919fb47753407872cfb342cf3eda7f7b.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/ea896524-e647-4a5c-a875-105e473c0ae2.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:29.821083",
                    "totalItems": 26,
                    "contentKey": "philmerrell/2025-01-23/ba9ce641-35b2-4b2e-b3be-1e838f092307.json.content.json",
                    "name": "PolicyManual_Sec07_07620_2025-01-02_PDF.pdf",
                    "totalTokens": 10658,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07620_2025-01-02_PDF.pdf",
                  "raw": "",
                  "id": "global/192c7fd75ab013db5b423835c7a90f7d15bf48f589a5738bc16a1a04ed885e01.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/ba9ce641-35b2-4b2e-b3be-1e838f092307.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:30.704200",
                    "totalItems": 8,
                    "contentKey": "philmerrell/2025-01-23/5b8d2c39-744b-48e2-bbdf-894524d38f44.json.content.json",
                    "name": "PolicyManual_Sec07_07640_2024-01-09_PDF.pdf",
                    "totalTokens": 2756,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07640_2024-01-09_PDF.pdf",
                  "raw": "",
                  "id": "global/1986e56bb2ee4f7cd4522db17684b54ffae214d24aa6075d9f96658807456c19.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/5b8d2c39-744b-48e2-bbdf-894524d38f44.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:31.996930",
                    "totalItems": 4,
                    "contentKey": "philmerrell/2025-01-23/46e6cdf9-0bca-4199-9c14-0f03db5bc1b6.json.content.json",
                    "name": "PolicyManual_Sec07_07070_2017-02_PDF.pdf",
                    "totalTokens": 1244,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07070_2017-02_PDF.pdf",
                  "raw": "",
                  "id": "global/250acb0da5b0ceea2ac2531b0bdf4994690c34a79a330bd4728f1905a35dd8ee.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/46e6cdf9-0bca-4199-9c14-0f03db5bc1b6.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:29.707759",
                    "totalItems": 5,
                    "contentKey": "philmerrell/2025-01-23/f8d89971-b634-4fbb-a05b-cd58f47ab351.json.content.json",
                    "name": "PolicyManual_Sec07_07220_2025-01-03_PDF.pdf",
                    "totalTokens": 1739,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07220_2025-01-03_PDF.pdf",
                  "raw": "",
                  "id": "global/2570a30577a197e7eac89b29723d93ef3dfd8f5716ff13def67afbb216050892.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/f8d89971-b634-4fbb-a05b-cd58f47ab351.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:27.843088",
                    "totalItems": 12,
                    "contentKey": "philmerrell/2025-01-23/f7bd852a-a435-413b-a9a2-a08c4d20739f.json.content.json",
                    "name": "PolicyManual_Sec07_07170_2024-08-02_PDF.pdf",
                    "totalTokens": 4326,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07170_2024-08-02_PDF.pdf",
                  "raw": "",
                  "id": "global/2a26a8f977ab0e9c6b3dce953a4205c0302788811a2f0c9ca89cc9dc5d0e4362.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/f7bd852a-a435-413b-a9a2-a08c4d20739f.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:32.999452",
                    "totalItems": 4,
                    "contentKey": "philmerrell/2025-01-23/40e7dd3d-f5ce-462b-97d0-c3f29566e10f.json.content.json",
                    "name": "PolicyManual_Sec07_07400_2013-04_PDF.pdf",
                    "totalTokens": 1178,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07400_2013-04_PDF.pdf",
                  "raw": "",
                  "id": "global/2fdeb5b95ba31a5d7a209d4e4a653d4a071a0a0b359f3085719c7bde16228618.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/40e7dd3d-f5ce-462b-97d0-c3f29566e10f.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:33.744875",
                    "totalItems": 3,
                    "contentKey": "philmerrell/2025-01-23/d34ba9ed-6a22-4b26-b183-34734f8db687.json.content.json",
                    "name": "PolicyManual_Sec07_07030_2013-04_PDF.pdf",
                    "totalTokens": 752,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07030_2013-04_PDF.pdf",
                  "raw": "",
                  "id": "global/37cd199af459c459031e0aba3f5ff082ac9f7b9ac75524ba484853316bba8d6f.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/d34ba9ed-6a22-4b26-b183-34734f8db687.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:31.105140",
                    "totalItems": 8,
                    "contentKey": "philmerrell/2025-01-23/2b251ea2-4406-4e6d-8e32-49c7edc40647.json.content.json",
                    "name": "PolicyManual_Sec07_07020_2015-06_Word.pdf",
                    "totalTokens": 2991,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07020_2015-06_Word.pdf",
                  "raw": "",
                  "id": "global/46e9aca7fe591795a1da9cddd3c5b0c68b296d51c1a6e91f871fb7dff2d23a0d.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/2b251ea2-4406-4e6d-8e32-49c7edc40647.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:30.405277",
                    "totalItems": 3,
                    "contentKey": "philmerrell/2025-01-23/7d5d9d65-328e-4f29-88c6-f8cb68ab59fa.json.content.json",
                    "name": "PolicyManual_Sec07_07260_2016-04_PDF.pdf",
                    "totalTokens": 778,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07260_2016-04_PDF.pdf",
                  "raw": "",
                  "id": "global/49fcde79d7953c8805866fe1dc634a0e3bd76c174278d9226096e71b3b6605d3.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/7d5d9d65-328e-4f29-88c6-f8cb68ab59fa.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:31.106018",
                    "totalItems": 11,
                    "contentKey": "philmerrell/2025-01-23/b5f195b9-35e8-4514-8d4a-347f6ca450ff.json.content.json",
                    "name": "PolicyManual_Sec07_07005_2021-12-21_PDF.pdf",
                    "totalTokens": 3985,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07005_2021-12-21_PDF.pdf",
                  "raw": "",
                  "id": "global/5cb0c097ebc2c93a1024d52559e4070116bd747e19de5c94ba0991b084efbc9d.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/b5f195b9-35e8-4514-8d4a-347f6ca450ff.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:26.007726",
                    "totalItems": 5,
                    "contentKey": "philmerrell/2025-01-23/a6413deb-56d6-4b1c-8830-463addaaee0a.json.content.json",
                    "name": "PolicyManual_Sec07_07195_2016-01_PDF.pdf",
                    "totalTokens": 1648,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07195_2016-01_PDF.pdf",
                  "raw": "",
                  "id": "global/5d6b866012a98f3c04e760fe8d220e5416e47bf248fe6524d4ecf4d69369841d.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/a6413deb-56d6-4b1c-8830-463addaaee0a.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:28.891066",
                    "totalItems": 5,
                    "contentKey": "philmerrell/2025-01-23/3e09bfa8-4bf3-4cfe-9c07-cffc06dc5b1a.json.content.json",
                    "name": "PolicyManual_Section07_07060_2013-08_PDF.pdf",
                    "totalTokens": 1389,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Section07_07060_2013-08_PDF.pdf",
                  "raw": "",
                  "id": "global/62104c6b0134f1eac3ddb02827c3de0d8dd806da4f7ec1d8ef86c12bd6ba90df.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/3e09bfa8-4bf3-4cfe-9c07-cffc06dc5b1a.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:26.084325",
                    "totalItems": 4,
                    "contentKey": "philmerrell/2025-01-23/7efcceee-a872-409b-b917-22706de8abb0.json.content.json",
                    "name": "PolicyManual_Sec07_07015_2012-07_PDF.pdf",
                    "totalTokens": 1170,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07015_2012-07_PDF.pdf",
                  "raw": "",
                  "id": "global/62713ad3ec7608f15b55a4909f0705d1f05309fc58387f3a6e77e4cbfaf02fd7.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/7efcceee-a872-409b-b917-22706de8abb0.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:30.797634",
                    "totalItems": 8,
                    "contentKey": "philmerrell/2025-01-23/671ec3d5-65c8-4de7-92fd-a348638e11be.json.content.json",
                    "name": "PolicyManual_Sec07_07610_2024-10-18_PDF.pdf",
                    "totalTokens": 2870,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07610_2024-10-18_PDF.pdf",
                  "raw": "",
                  "id": "global/6bd8b08ce55b2caad52cfcb139f18c3f0b11fff1faa80ae8dc0529f14ea94f9b.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/671ec3d5-65c8-4de7-92fd-a348638e11be.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:32.688556",
                    "totalItems": 3,
                    "contentKey": "philmerrell/2025-01-23/a69043dd-7fa5-4107-89bb-9a2f5ff05eec.json.content.json",
                    "name": "PolicyManual_Sec02_02270_2019-07_PDF.pdf",
                    "totalTokens": 577,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec02_02270_2019-07_PDF.pdf",
                  "raw": "",
                  "id": "global/6d0b746ee98b652acd6829e60a7fac84a2d0450b27302de8add0a49d4d488db6.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/a69043dd-7fa5-4107-89bb-9a2f5ff05eec.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:33.364951",
                    "totalItems": 4,
                    "contentKey": "philmerrell/2025-01-23/4b0d84f8-aeb9-414d-9f75-4705a6a8c7fe.json.content.json",
                    "name": "PolicyManual_Sec07_07010_2022-09-26_PDF.pdf",
                    "totalTokens": 1386,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07010_2022-09-26_PDF.pdf",
                  "raw": "",
                  "id": "global/72e1096c1221cb571ae044810dcd6f913ea1aa0d6c892d3424dbf23da579d22f.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/4b0d84f8-aeb9-414d-9f75-4705a6a8c7fe.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:31.713113",
                    "totalItems": 6,
                    "contentKey": "philmerrell/2025-01-23/bad5969c-f262-4cb0-8963-6e4ef01bf15d.json.content.json",
                    "name": "PolicyManual_Sec07_07590_2021-10-22_PDF.pdf",
                    "totalTokens": 1986,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07590_2021-10-22_PDF.pdf",
                  "raw": "",
                  "id": "global/7397103fd0c960399a82584bee4e733929a4611c2da7da8274021ecd938c60e8.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/bad5969c-f262-4cb0-8963-6e4ef01bf15d.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:29.780589",
                    "totalItems": 2,
                    "contentKey": "philmerrell/2025-01-23/8ff1a285-fda4-4e1a-ab01-1f8e31ba8ede.json.content.json",
                    "name": "PolicyManual_Sec07_07270_2011-08_Word.pdf",
                    "totalTokens": 453,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07270_2011-08_Word.pdf",
                  "raw": "",
                  "id": "global/78f595ec53ed0b5badbfff4598d929560ace8ca0e081cb95f06a1411a4faf53e.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/8ff1a285-fda4-4e1a-ab01-1f8e31ba8ede.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:33.500490",
                    "totalItems": 3,
                    "contentKey": "philmerrell/2025-01-23/233fa5a8-ba2b-4301-aeb0-ded76bef7568.json.content.json",
                    "name": "PolicyManual_Sec07_07660_2023-08-17_PDF.pdf",
                    "totalTokens": 734,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07660_2023-08-17_PDF.pdf",
                  "raw": "",
                  "id": "global/7b85c396244725a02428a5ae20ba1c46599172a549f163d7b5a3162a1f2ae6ad.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/233fa5a8-ba2b-4301-aeb0-ded76bef7568.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:28.541523",
                    "totalItems": 10,
                    "contentKey": "philmerrell/2025-01-23/7f25402e-906f-4bc3-9da5-272dfb48d2cf.json.content.json",
                    "name": "PolicyManual_Sec07_07600_2023-03-23_PDF.pdf",
                    "totalTokens": 3685,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07600_2023-03-23_PDF.pdf",
                  "raw": "",
                  "id": "global/887b0ae678edd7192d54f8d13763fda840e4c1e0df11ea011d3476c644c168ec.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/7f25402e-906f-4bc3-9da5-272dfb48d2cf.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:29.284308",
                    "totalItems": 5,
                    "contentKey": "philmerrell/2025-01-23/d9588380-2b7d-4bab-b975-0923919b29f7.json.content.json",
                    "name": "PolicyManual_Sec07_07500_2010-05_PDF.pdf",
                    "totalTokens": 1763,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07500_2010-05_PDF.pdf",
                  "raw": "",
                  "id": "global/92caa3cc35f56239fe590acceee0434c2b1de3787f340036be4d19477e5b6db2.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/d9588380-2b7d-4bab-b975-0923919b29f7.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:31.422685",
                    "totalItems": 4,
                    "contentKey": "philmerrell/2025-01-23/18b4b12b-cda0-43ce-b3f2-66d8a7bab8cf.json.content.json",
                    "name": "PolicyManual_Sec07_07580_01-20_PDF.pdf",
                    "totalTokens": 1263,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07580_01-20_PDF.pdf",
                  "raw": "",
                  "id": "global/9560e3a0bd7504253a0f62a904edd72c32c84ec8285bd24ee71e5d0b1ff16196.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/18b4b12b-cda0-43ce-b3f2-66d8a7bab8cf.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:33.123058",
                    "totalItems": 5,
                    "contentKey": "philmerrell/2025-01-23/9d155cdc-0b12-4bd5-a33e-4c6a1e7a8879.json.content.json",
                    "name": "PolicyManual_Sec07_07520_2019-07_Word.pdf",
                    "totalTokens": 1469,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07520_2019-07_Word.pdf",
                  "raw": "",
                  "id": "global/98afb912047f34a82afd85409d23a0eb520469dc221a97e4cc6339e8d6a04a3c.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/9d155cdc-0b12-4bd5-a33e-4c6a1e7a8879.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:32.238489",
                    "totalItems": 6,
                    "contentKey": "philmerrell/2025-01-23/ba81bec3-51f8-4ff6-b1b8-f1a6f28a07e8.json.content.json",
                    "name": "PolicyManual_Sec07_07450_2024-01-29_PDF.pdf",
                    "totalTokens": 1818,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07450_2024-01-29_PDF.pdf",
                  "raw": "",
                  "id": "global/9b62f01a1051404aab1c57a69a8c0432dbdd646e546911a50dd2f131740238f6.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/ba81bec3-51f8-4ff6-b1b8-f1a6f28a07e8.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:32.637675",
                    "totalItems": 22,
                    "contentKey": "philmerrell/2025-01-23/6b21b4a3-f4df-4bef-bf7d-0a39341ff29d.json.content.json",
                    "name": "PolicyManual_Sec07_07650_2023-09-21_PDF.pdf",
                    "totalTokens": 8576,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07650_2023-09-21_PDF.pdf",
                  "raw": "",
                  "id": "global/9bd85f90e727c494edd0ef56573a1dab687ab145f5dafdab46200997d0f4eabf.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/6b21b4a3-f4df-4bef-bf7d-0a39341ff29d.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:32.363141",
                    "totalItems": 4,
                    "contentKey": "philmerrell/2025-01-23/cee9e809-56f6-4e46-863f-68d5f6f3f059.json.content.json",
                    "name": "PolicyManual_Sec07_07140_2018-03_PDF.pdf",
                    "totalTokens": 1046,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07140_2018-03_PDF.pdf",
                  "raw": "",
                  "id": "global/a0ac05cca70e96ca87a25df9e3ddfc6aa3cbc6f3dde1d1ae1a8ba4e3dd97916c.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/cee9e809-56f6-4e46-863f-68d5f6f3f059.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:32.320857",
                    "totalItems": 8,
                    "contentKey": "philmerrell/2025-01-23/8317541f-ab09-4258-bd27-fb5f530c4274.json.content.json",
                    "name": "PolicyManual_Sec07_07530_2019-07_PDF.pdf",
                    "totalTokens": 2369,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07530_2019-07_PDF.pdf",
                  "raw": "",
                  "id": "global/a809eb647e5285cfecd31c68320f8dc4ed433042ae3913bf0e6a9deb67dd57a7.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/8317541f-ab09-4258-bd27-fb5f530c4274.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:30.356271",
                    "totalItems": 4,
                    "contentKey": "philmerrell/2025-01-23/64d73dfd-46d7-4c1f-b58a-5ea1c21d849d.json.content.json",
                    "name": "PolicyManual_Sec07_07300_2013-04_PDF.pdf",
                    "totalTokens": 1005,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07300_2013-04_PDF.pdf",
                  "raw": "",
                  "id": "global/a835391945401d3647632949466a9921a36e586c216edc9425623b5512242e8d.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/64d73dfd-46d7-4c1f-b58a-5ea1c21d849d.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:32.657925",
                    "totalItems": 6,
                    "contentKey": "philmerrell/2025-01-23/304c29f5-3927-4609-8b2c-1a57c29aeec8.json.content.json",
                    "name": "PolicyManual_Sec07_07045_2017-10_PDF.pdf",
                    "totalTokens": 1882,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07045_2017-10_PDF.pdf",
                  "raw": "",
                  "id": "global/ad4025c058c2c25ff442366a0d36448042ee302c302355bfd65feacf50083b87.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/304c29f5-3927-4609-8b2c-1a57c29aeec8.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:32.743425",
                    "totalItems": 6,
                    "contentKey": "philmerrell/2025-01-23/7e1d8c56-972b-467d-be09-5c3690abf566.json.content.json",
                    "name": "PolicyManual_Sec07_07510_2013-11_PDF.pdf",
                    "totalTokens": 1828,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07510_2013-11_PDF.pdf",
                  "raw": "",
                  "id": "global/b76fab1daddc9e702c8582df1e27470f55065b4a042708ca89798656dd489341.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/7e1d8c56-972b-467d-be09-5c3690abf566.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:31.580027",
                    "totalItems": 12,
                    "contentKey": "philmerrell/2025-01-23/1926bac1-1d87-479c-bf91-c0424ef77f66.json.content.json",
                    "name": "PolicyManual_Sec07_07570_01-02-25_PDF.pdf",
                    "totalTokens": 4310,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07570_01-02-25_PDF.pdf",
                  "raw": "",
                  "id": "global/b87d5341edb0607c2f161b1ced0c2f0ef1a561dc975ca53f96d2766e1bb64b40.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/1926bac1-1d87-479c-bf91-c0424ef77f66.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:33.117538",
                    "totalItems": 14,
                    "contentKey": "philmerrell/2025-01-23/c257c75d-bfa6-45fc-bd41-52bc70d34cb4.json.content.json",
                    "name": "PolicyManual_Sec07_07230_2022-12-14_PDF.pdf",
                    "totalTokens": 5635,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07230_2022-12-14_PDF.pdf",
                  "raw": "",
                  "id": "global/d18e3887dde00782d8cd1fcdfaae458c7b44dd79bbcf9a588abf194740570f5c.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/c257c75d-bfa6-45fc-bd41-52bc70d34cb4.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:28.943103",
                    "totalItems": 10,
                    "contentKey": "philmerrell/2025-01-23/c5d8e359-cf25-484f-b0c7-c02a8c9fe2b7.json.content.json",
                    "name": "PolicyManual_Sec07_07630_2024-01-09_PDF.pdf",
                    "totalTokens": 3717,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07630_2024-01-09_PDF.pdf",
                  "raw": "",
                  "id": "global/df5cf31879d52ea046bc46374bf2eb4b80f04b4fff23c918e3e943b3737d55f3.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/c5d8e359-cf25-484f-b0c7-c02a8c9fe2b7.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:30.057637",
                    "totalItems": 5,
                    "contentKey": "philmerrell/2025-01-23/6fc1dcd5-43ec-4a4d-9a7d-8460cbabb32b.json.content.json",
                    "name": "PolicyManual_Sec07_07430_2022-08-04_PDF.pdf",
                    "totalTokens": 1605,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07430_2022-08-04_PDF.pdf",
                  "raw": "",
                  "id": "global/e3bed924d2fd28a35c2d48ee91c8dff42fcd59d120675fb38036198454c9203b.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/6fc1dcd5-43ec-4a4d-9a7d-8460cbabb32b.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:32.103757",
                    "totalItems": 6,
                    "contentKey": "philmerrell/2025-01-23/5cfe0500-0863-4a66-bd10-67001bd34e53.json.content.json",
                    "name": "PolicyManual_Sec07_07560_2019-09_PDF.pdf",
                    "totalTokens": 2217,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07560_2019-09_PDF.pdf",
                  "raw": "",
                  "id": "global/ee9c832cfcfab38825f0e5e4acfef9ecc4b23a2e90f90defdd27efaad6f4c28e.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/5cfe0500-0863-4a66-bd10-67001bd34e53.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:31.832779",
                    "totalItems": 3,
                    "contentKey": "philmerrell/2025-01-23/7cbc1f03-e1f6-4083-b5f3-669653b1592f.json.content.json",
                    "name": "PolicyManual_Sec07_07035_2021-03-26_PDF.pdf",
                    "totalTokens": 912,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07035_2021-03-26_PDF.pdf",
                  "raw": "",
                  "id": "global/f1476eeece8df50faff155ba900c0be1c6aec17e04a7b0c06fab3dfff3190aac.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/7cbc1f03-e1f6-4083-b5f3-669653b1592f.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:33.445074",
                    "totalItems": 3,
                    "contentKey": "philmerrell/2025-01-23/071fefeb-5511-4591-97bb-94b9b5685bf9.json.content.json",
                    "name": "PolicyManual_Sec07_07540_2019-07_PDF-1.pdf",
                    "totalTokens": 813,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07540_2019-07_PDF-1.pdf",
                  "raw": "",
                  "id": "global/f4b8fa4214e15930f95edd99772eb00d6d04d1be4747479c8efc0e11a08e059b.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/071fefeb-5511-4591-97bb-94b9b5685bf9.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:30.007419",
                    "totalItems": 11,
                    "contentKey": "philmerrell/2025-01-23/1002c396-7f2b-4903-a8fb-74860f24b78e.json.content.json",
                    "name": "PolicyManual_Sec07_07000_2025-01-08_PDF.pdf",
                    "totalTokens": 4230,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07000_2025-01-08_PDF.pdf",
                  "raw": "",
                  "id": "global/f7d92b18d721add8a9cc26383f9e796a9e6eff5b021d1069e7fe8298b5dfee4e.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/1002c396-7f2b-4903-a8fb-74860f24b78e.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:28.258331",
                    "totalItems": 8,
                    "contentKey": "philmerrell/2025-01-23/7c839b8a-101c-4aec-9a6d-87cdac479336.json.content.json",
                    "name": "PolicyManual_Sec07_07420_2024-01-09_PDF.pdf",
                    "totalTokens": 2917,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07420_2024-01-09_PDF.pdf",
                  "raw": "",
                  "id": "global/fb6eeec76a30ce22dd106fef40abeaa57426afc3d01500518a7836522c7ed827.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/7c839b8a-101c-4aec-9a6d-87cdac479336.json"
                },
                {
                  "metadata": {
                    "createdAt": "2025-01-23T21:29:32.425415",
                    "totalItems": 4,
                    "contentKey": "philmerrell/2025-01-23/fb8539ee-da36-406e-9416-bbebe0590a3c.json.content.json",
                    "name": "PolicyManual_Sec07_07025_2012-09_PDF.pdf",
                    "totalTokens": 1075,
                    "locationProperties": [
                      "page_number"
                    ],
                    "tags": [],
                    "props": {}
                  },
                  "data": "",
                  "name": "PolicyManual_Sec07_07025_2012-09_PDF.pdf",
                  "raw": "",
                  "id": "global/fe3bf716e903c9cdab99ee1bfcd7b44f758a95be370595df4ca63275509e3033.content.json",
                  "type": "application/pdf",
                  "key": "philmerrell/2025-01-23/fb8539ee-da36-406e-9416-bbebe0590a3c.json"
                }
              ],
              "name": "HR Policy Assistant",
              "hash": "b1a97c7b94c49070fe08b907f8c000ca13bb60a0918f38061432de4c69a06d70",
              "data": {
                "conversationTags": [],
                "access": {
                  "read": true,
                  "write": true
                },
                "dataSourceOptions": {
                  "insertAttachedDocumentsMetadata": false,
                  "insertAttachedDocuments": true,
                  "insertConversationDocuments": false,
                  "disableDataSources": true,
                  "insertConversationDocumentsMetadata": false,
                  "ragConversationDocuments": true,
                  "includeDownloadLinks": false,
                  "ragAttachedDocuments": true
                },
                "provider": "amplify",
                "featureOptions": {
                  "IncludeArtifactsInstr": true
                },
                "apiCapabilities": [],
                "messageOptions": {
                  "includeAssistantLineNumbers": false,
                  "includeMessageIds": false,
                  "includeUserLineNumbers": false
                },
                "tags": [
                  ""
                ]
              },
              "disclaimer": "The HR Policy Assistant is designed to help navigate Boise State Policy. All information you receive should be verified by Boise State HR.",
              "updatedAt": "2025-01-23T23:55:28",
              "dataSourcesHash": "74234e98afe7498fb5daf1f36ac2d78acc339464f950703b8c019892f982b90b",
              "description": "The HR Policy Assistant has access to all policy documentation on the Boise State HR website. This can be a starting point for any questions around HR policy.",
              "id": "ast/56d3046f-0d5a-4765-8197-f08a5eb110f5",
              "tags": [
                ""
              ],
              "instructionsHash": "ffe8ae7cbb6afff9f596e4e19bdacbe84df6eb6e24219e291264114bac455ee4"
            }
          },
          "conversationTags": [],
          "access": {
            "read": true,
            "write": true
          },
          "dataSourceOptions": {
            "insertAttachedDocumentsMetadata": false,
            "insertAttachedDocuments": true,
            "insertConversationDocuments": false,
            "disableDataSources": true,
            "insertConversationDocumentsMetadata": false,
            "ragConversationDocuments": true,
            "includeDownloadLinks": false,
            "ragAttachedDocuments": true
          },
          "provider": "amplify",
          "featureOptions": {
            "IncludeArtifactsInstr": true
          },
          "apiCapabilities": [],
          "messageOptions": {
            "includeAssistantLineNumbers": false,
            "includeMessageIds": false,
            "includeUserLineNumbers": false
          },
          "tags": [
            ""
          ],
          "noCopy": true,
          "noEdit": false,
          "noDelete": false,
          "noShare": false
        }
      }
    ]
      }
    