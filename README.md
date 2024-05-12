# DreamSinger

## Introduction

DreamSinger is a web application that enables users to generate covered songs using the open-source project [AICoverGen](https://github.com/SociallyIneptWeeb/AICoverGen).

## Features Demo Video

The features demo video is provided [here](https://drive.google.com/file/d/1J9O2HuokkDFKqkp9WnPjT7rKUYb5Cona/view?usp=drive_link).

## Installation Instructions

### Frontend
After ensuring that `npm` is installed, follow these steps:
```
cd frontend
npm install
npm start
```
This will start the application at `http://localhost:3000`.

### Backend
It is recommended to have Python 3.9 and CUDA installed on your computer.
1.  Install required packages for AI Models:
    ```
    cd backend/AICoverGen
    pip install -r requirements.txt
    ```
2. Download the Hubert checkpoints (this only need to be run once):
    ```
    python src/download_models.py
    ```
3. Download the pretrain RVC checkpoints and unzip them into `backend/AICoverGen/rvc_models`:
    - https://huggingface.co/PlayerBPlaytime/My-Models/resolve/main/MJInvincibleEra.zip
    - https://huggingface.co/coreliastreet/arianagrande2024/resolve/main/eternal.zip?download=true
4. Rename the folders as follows:
    - `MJInvincibleEra` to `0`
    - `eternal` to `1`
5. Install required packages and setup environment for backend:
    ```
    cd backend
    pip install -r requirements.txt
    python manage.py makemigrations && python manage.py migrate
    ```
6. Run the backend on port `8000`:
    ```
    python manage.py runserver
    ```

## Testing
We provide unit tests for our backend server. Use the following command to run the tests:
```
cd backend
python manage.py test
```

## Terms of Use
Since our application is based on [AICoverGen](https://github.com/SociallyIneptWeeb/AICoverGen) and is for a university in-class project, all users are required to adhere to the guidelines outlined in its terms of use. The use of the converted voice for the following purposes is prohibited:
- Criticizing or attacking individuals.
- Advocating for or opposing specific political positions, religions, or ideologies.
- Publicly displaying strongly stimulating expressions without proper zoning.
- Selling of voice models and generated voice clips.
- Impersonation of the original owner of the voice with malicious intentions to harm/hurt others.
- Fraudulent purposes that lead to identity theft or fraudulent phone calls.
- Any commercial use of the application.