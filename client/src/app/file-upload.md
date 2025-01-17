# File Upload Flow

1. Get a presigned URL to upload to s3

POST to `${api.url}/files/upload`

```javascript
data: {
    actions: [],
    data: {},
    knowledgeBase: "default",
    name: file.name,
    tags: [],
    type: file.type,
}
```

This request returns a PresignedUrlResponse

```typescript
export interface PresignedUrlResponse {
  contentUrl: string;
  key: string;
  metadataUrl: string;
  statusUrl: string;
  success: boolean;
  uploadUrl: string;
}
```

2. Upload the file to the uploadUrl returned from the PresignedUrlResponse

PUT to `uploadResponse.uploadUrl`

3. After the file is successfully uploaded, we call the metadataUrl endpoint from the PresignedUrlResponse.

GET to `uploadResponse.metadataUrl`
This returns the metadata needed to construct our DataSource object that will be a part of the chat request object.

```javascript
{
    "name": "document_file_name.docx",
    "totalItems": 29,
    "locationProperties": [
        "section_number",
        "paragraph_number",
        "section_title"
    ],
    "contentKey": "philmerrell/2025-01-16/872319b0-068d-4626-866b-15a8a45d2cb4.json.content.json",
    "createdAt": "2025-01-17T02:39:59.745845",
    "totalTokens": 440,
    "tags": [],
    "props": {}
}
```

A `DataSource` object is created by:

- Prepending 's3://' to the `key` attribute of the key value returned by the `PresignedUrlResponse` to the `id` attribute.
- Adding the metadata response to the `metadata` attribute.
- Adding the `name` and `type` attributes of the file


```javascript
{
    id: "s3://philmerrell/2025-01-17/7c907229-0b1c-4dc8-8562-574ba628386a.json"
    metadata: MetaDataResponse,
    name: "document_file_name.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
} 
```

This `DataSource` is pushed into two places in chat request object:
- the `dataSources` array at the root level of the chat request object
- the `dataSources` array in the `data` attribute of the user `Message` object inside the `messages` array of the chat request.

The chat request object is then submited to the CHAT_ENDPOINT url and should be able to access the content of the user message in addition to the content of the dataSource.


## Questions

1. Given a typical chat request with a document dataSource, I would like to better understand the text extraction process. I see references to text extraction on both the front end and the backend (I assume a typical text extraction happens on the backend and is put into a dynamo db table).
2. I would like to better understand how the content of a `DataSource` is inserted into the context of a conversation (it looks like there is a process on the CHAT_ENDPOINT when a dataSource is detected that fetches a data source and inserts it into the conversation just hoping to wrap my head around that part).
3. After an initial upload, the data source is in both the root level `dataSources` array and inside the user message object. In subsequent user messages in the same conversation, the root level `dataSources` array is no longer used and only the message dataSource resides. Why does a reference exist in multiple locations in a chat request?

I would like to understand these items a little better to help me troubleshoot an issue where the code in amplify-lambda-js chat request endpoint can't fetch the data source from s3 even though it appears I'm uploading, constructing the objects, and sending the chat request as required (I'm clearly doing something wrong in the process).