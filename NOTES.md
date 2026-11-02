# Assessment Notes

### 1. What would you change about your data model or API design if this needed to support multiple users, each with their own private task list?

I would add a `userId` field to the Task model and associate each task with its respective user. I would also implement authentication and authorization using JWT so that users can only create, access, update, and delete their own tasks.

### 2. If the task list could grow to thousands of items, what's the first performance concern you'd address, and how?

My first concern would be fetching and processing all tasks at once, which can affect API response time and application performance. I would implement pagination and database-level filtering and sorting, along with appropriate MongoDB indexes on frequently queried fields.

### 3. Did you use any AI coding tools during this task? If so, describe one instance where you changed or rejected a suggestion it gave you, and why.

Yes, I used ChatGPT as an AI coding assistant to understand implementation approaches and debug issues. One example was adapting the frontend API service to extract the `data` property from the backend response instead of using the entire response object, ensuring that the React components received the expected task data.