# DrNiceFellow's Web-based Intelligent Roleplaying Sandbox

![Screenshot](/assets/screenshot.png)

This is a lightweight and intelligent Role Playing Sandbox with Web UI developed by Dr. Nicefellow. It is designed to provide a user-friendly interface for interacting with a chatbot. The backend engine is powered by OpenAI API with completions function. It is tested with Tabbyapi.

One of the key advantages of this chatbot over others, such as SillyTavern, is its ability to automatically determine who should talk next and its support for third-party narrators to describe environment changes and other context. These features enhance the flow of the conversation and provide a more engaging user experience. [mistralai/Mixtral-8x7B-Instruct-v0.1](https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1) as the backend LLM has been tested working well. [SanjiWatsuki/Silicon-Maid-7B](https://huggingface.co/SanjiWatsuki/Silicon-Maid-7B) as well.

## Features

- User-friendly chat interface
- Backend engine powered by OpenAI API
- Automatic determination of the next speaker in the conversation
- Support for third-party narrators to describe context changes

## Requirements

- Python
- Flask
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

Open your web browser and navigate to `http://localhost:7863`. You can start chatting with the bot by typing your message in the chat input field and pressing the "Send" button.

## Role Play Scenarios

This repository comes with two role play scenarios for you to explore. We are constantly working on creating more engaging and diverse scenarios for our users. More Role Play scenarios will be added to our Huggingface Page. You can check them out at [DrNicefellow's Huggingface Page](https://huggingface.co/DrNicefellow).

## TODO

- [x] Add start batch file for Windows
- [x] Add host parameter control to the Web UI
- [x] Add function for users to modify chat history
- [ ] Add a feature to allow users to customize the chatbot's behavior

## License

This project is licensed under the terms of the Apache 2.0 License.

## Request a Feature

We are always looking forward to hearing from our users and we welcome their input on features they would like to see in future versions of our application. If you have a feature request, please feel free to open an issue on our GitHub repository describing the feature you would like to see. We can't promise that we'll implement every feature request, but we will certainly consider each one carefully. Your feedback is invaluable in helping us improve our application.

## Disclaimer

This project is intended for personal use. It may contain vulnerabilities and security concerns. Users should use this project at their own risk. The developers of this project will not be responsible for any damage or issues that may arise from using this project.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


## Feeling Generous? 😊
Eager to buy me a cup of 2$ coffe or iced tea?🍵☕ Sure, here is the link: [https://ko-fi.com/drnicefellow](https://ko-fi.com/drnicefellow). Please add a note on which one you want me to drink?