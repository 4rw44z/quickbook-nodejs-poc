# Project Title

This project integrates with QuickBooks using OAuth2 for authentication and Supabase for backend services.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Supabase account
- QuickBooks Developer account

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-repo/project.git
    cd project
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

## Configuration

1. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    CLIENT_ID=your_quickbooks_client_id
    CLIENT_SECRET=your_quickbooks_client_secret
    ENVIRONMENT=sandbox_or_production
    REDIRECT_URL=your_redirect_url
    MINOR_VERSION=your_minor_version
    ```

2. Update the Supabase configuration in `index.js`:
    ```javascript
    const supabase = supabaseClient.createClient({
        apiKey: '<API_KEY>',
        project: '<PROJECT_ID>'
    });
    ```

## Running the Project

1. Start the application:
    ```sh
    npm start
    ```

2. The application will run and handle OAuth2 authentication with QuickBooks and interact with Supabase.

## Troubleshooting

- Ensure all environment variables are correctly set in the `.env` file.
- Check the console for any error messages and stack traces.

For further assistance, refer to the official documentation of [QuickBooks API](https://developer.intuit.com/app/developer/qbo/docs/get-started) and [Supabase](https://supabase.io/docs).