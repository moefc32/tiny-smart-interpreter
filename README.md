# Tiny Smart Interpreter
<a href="https://opensource.org/license/mit"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" height="24" /></a>
<a href="https://pnpm.io/"><img src="https://img.shields.io/badge/Package-PNPM-orange?style=flat-square" height="24" /></a>
<img src="https://img.shields.io/badge/Module-ECMAScript-yellow?style=flat-square" height="24" />

A monolith application that can interprets various user input using Google Gemini, submitted as part of online training assignments

## Features
- Chat interaction with an AI assistant using Google Gemini
- Smart file interpretation (images, documents, audio, etc.) capable of summarizing and analyzing file content
- Automatic database setup for storing AI chat history and Google Gemini configurations
- Basic caching of AI assistant chat responses

## Stack Used
- [SvelteKit](https://svelte.dev/)
- [Tailwind](https://tailwindcss.com/)
- [daisyUI](https://daisyui.com/)
- [Google Gemini](https://gemini.google.com/)
- [SQLite](https://www.sqlite.org/)

## Local Preview
1. Clone this repository to your local computer
2. Copy the default environment file and ensure all variables are correctly filled
   ```sh
   cp .env.example .env
   ```
3. Install all required dependencies
   ```sh
   pnpm i
   ```
4. Run the application in development mode
   ```sh
   pnpm run dev
   ```
