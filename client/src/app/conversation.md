# The Anatomy of a Conversation

This is a high-level explanation of a "Conversation" in the Amplify GenAI platform.

1. Stateless Nature of LLMs
LLMs process input based on the context provided in the current conversation. LLMs don’t inherently remember information from past interactions unless that information is included explicitly in the prompt. Without additional mechanisms (such as the Amplify GenAI platform), LLMs reset their "memory" after each interaction.

2. Adding Conversation Context and "Memory" to LLMs
External systems can give LLMs memory by storing information about interactions and reintroducing it into the conversation context. This can be done by retaining the state of an on going conversation. In each conversation, Amplify (and other LLM applications) retain the user prompts and the LLM responses so that the application can maintain a record of an ongoing conversations and past interactions in order to feed it into the model as a part of the conversation.

a. Conversation History
The application can maintain a record of past interactions and feed it into the model as part of the prompt.
Example:
Interaction 1: "My name is Alice."
Interaction 2: "What's my name?"
The system includes the previous interaction in the prompt to remind the LLM: "Earlier, the user said their name is Alice."