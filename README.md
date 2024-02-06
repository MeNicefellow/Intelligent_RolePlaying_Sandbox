# DrNiceFellow's Web-based Intelligent Roleplaying Sandbox

![Screenshot](/assets/screenshot.png)

This is a sophisticated chat WebUI developed by Dr. Nicefellow. It is designed to provide a user-friendly interface for interacting with a chatbot. The backend engine is powered by OpenAI API, and the backend LLM should support the Llama Chat/Mistral Instruct prompt template. It is tested with Tabbyapi.

One of the key advantages of this chatbot over others, such as SillyTavern, is its ability to automatically determine who should talk next. This feature enhances the flow of the conversation and provides a more engaging user experience.

## Features

- User-friendly chat interface
- Backend engine powered by OpenAI API
- Support for Llama Chat/Mistral Instruct prompt template
- Automatic determination of the next speaker in the conversation

## Requirements

- Python
- Flask
- Flask-session
- YAML

## Installation

1. Clone the repository
2. Start the backend server and obtain the API key and host address.
3. Install the required packages using pip.
4. Create a `config.yml` file with the example example.config.yml and set the OpenAI API key.
5. Set your OpenAI API key in the `config.yml` file
6. Run the application:
   ```
   python app.py
   ```

## Usage

Open your web browser and navigate to `http://localhost:7860`. You can start chatting with the bot by typing your message in the chat input field and pressing the "Send" button.

## TODO

- Add support for other chat formats
- Add function calling

## License

This project is licensed under the terms of the Apache 2.0 License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Feeling Generous? 😊
Eager to buy me a cup of 2$ coffe or iced tea?🍵☕ Sure, here is the link: [https://ko-fi.com/drnicefellow](https://ko-fi.com/drnicefellow). Please add a note on which one you want me to drink?
