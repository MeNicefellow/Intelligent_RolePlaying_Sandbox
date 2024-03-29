from flask import Flask, render_template, request, jsonify,make_response#, session
#from flask_session import Session  # You may need to install this with pip
import requests
from flask import request, send_from_directory
import random
from datetime import datetime
import uuid
import re
app = Flask(__name__)
import yaml
import os

# Load keys from config.yml
with open("config.yml", 'r') as ymlfile:
    cfg = yaml.safe_load(ymlfile)
app.secret_key = cfg['secret_key']
OPENAI_API_KEY = cfg['openai_api_key']
user = cfg['user_name']
host = cfg['host']

# Configure server-side session
#app.config["SESSION_PERMANENT"] = False
#app.config["SESSION_TYPE"] = "filesystem"
#session_dir = os.path.join(app.instance_path, 'session')
#if not os.path.exists(session_dir):
#    os.makedirs(session_dir)
#app.config["SESSION_FILE_DIR"] = session_dir
#Session(app)


session = {}


@app.route('/save_story', methods=['POST'])
def save_story():
    if not os.path.exists('stories'):
        os.makedirs('stories')
    chat_history = request.get_json().get('story', '')
    filename = request.get_json().get('name', f'{datetime.now().strftime("%Y%m%d%H%M%S")}_{uuid.uuid4().hex[:6]}.txt')#
    with open(f'stories/{filename}.txt', 'w') as f:
        f.write(chat_history)
    return jsonify({'status': 'success', 'filename': filename})
@app.route('/load_story', methods=['GET'])
def load_story():
    filename = request.args.get('filename')
    if filename:
        try:
            with open(f'stories/{filename}', 'r') as f:
                content = f.read()
            return jsonify({'chat_history': content})
        except FileNotFoundError:
            return "Story not found", 404
    else:
        return "No filename provided", 400
@app.route('/get_stories', methods=['GET'])
def get_stories():
    if not os.path.exists('stories'):
        os.makedirs('stories')
    stories = os.listdir('stories')
    return jsonify({'stories': stories})

@app.route('/assets/backgrounds/<path:filename>')
def custom_static(filename):
    return send_from_directory('assets/backgrounds', filename)
@app.route('/next_background_image')
def next_background_image():
    current_image = request.args.get('current_image')
    images = os.listdir('assets/backgrounds')
    current_index = images.index(current_image)
    next_index = (current_index + 1) % len(images)  # Loop back to the first image
    next_image = images[next_index]
    return jsonify({'image_name': next_image})
@app.route('/background_image')
def background_image():
    # Assuming the first image is the default background
    image_name = os.listdir('assets/backgrounds')[0]
    return send_from_directory('assets/backgrounds', image_name)

@app.route('/download_chat_history', methods=['GET'])
def download_chat_history():
    chat_history = session.get('chat_history', '').replace('[INST]', 'User: ').replace('[/INST]', '\nBot: ')
    response = make_response(chat_history)
    response.headers["Content-Disposition"] = "attachment; filename=chat_history.txt"
    return response

@app.route('/')
def home():
    # Initialize chat history for new session
    if 'chat_history' not in session:
        session['chat_history'] = ''
    title = user+"'s Role Playing Sandbox"  # Replace 'xx' with the desired name
    return render_template('index.html', title=title)

@app.route('/ask', methods=['POST'])
def ask():
    if 'chat_history' not in session:
        session['chat_history'] = ''
    data = request.json
    chat_text = data['chatText']
    print("original chat_text:",chat_text)
    #chat_text = chat_text.replace('<div>','[Start]').replace('</div>','[End]\n')
    chat_text = re.sub('<div><div style="color: .*?;">', '[Start]', chat_text)
    chat_text = chat_text.replace('</div><button>Edit</button></div>', '[End]\n')
    chat_text = chat_text.replace('<i>','*').replace('</i>','*')
    #new_chat_history = re.sub('<div style="color: .*?;">', '', chat_text)
    #new_chat_history = new_chat_history.replace('</div>','[cut]\n')
    #new_chat_history = new_chat_history.replace('<i>','*').replace('</i>','*')
    #session['chat_history'] += new_chat_history
    print("chat_text:",chat_text)
    narrator = data['narratorText']
    print("narrator:",narrator)
    if len(narrator) == 0:
        narrator = "Mistral"
    print("new narrator:",narrator)
        



    max_tokens = data['max_tokens']
    min_p = data['min_p']
    top_k = data['top_k']
    top_p = data['top_p']
    temperature= data['temperature']
    #inst_beg = "[INST]"
    #inst_end = "[/INST]"
    prompt = chat_text
    #print("user:",session['user'])
    #print("assistant:",session['assistant'])
    
    payload = {
        "prompt": prompt,
        "model": "gpt-3.5-turbo-instruct",
        "max_tokens": max_tokens,
        "n_predict": max_tokens,
        "min_p": min_p,
        "stream": False,
        "seed": random.randint(
            1000002406736107, 3778562406736107
        ),  # Was acting weird without this
        "top_k": top_k,
        "top_p": top_p,
        "stop": ["</s>",narrator],
        "temperature": temperature,
    }
    
    
    response = requests.post(
        host,
        headers={
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENAI_API_KEY}",
        },
        json=payload,
        timeout=360,
        stream=False,
    )

    if response.status_code == 200:
        answer = response.json()['choices'][0]['text']
        print("Original answer:",answer)
        answer = answer.replace('[End]\n','')
        answer = answer.split('[Start]')
        #session['chat_history'] += '[cut]\n'.join(answer)
        print("answer:",answer)
        return jsonify({'answer': answer})
    else:
        print("error:",response)
        return jsonify({'error': 'Failed to fetch response from OpenAI'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=7863,debug=True)