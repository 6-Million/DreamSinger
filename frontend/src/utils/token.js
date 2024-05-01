//Encapsulating token access and deletion methods

const TOKENKEY = "token";

function getToken() {
  return localStorage.getItem(TOKENKEY);
}

function setToken(token) {
  localStorage.setItem(TOKENKEY, token);
}

function deleteToken() {
  localStorage.removeItem(TOKENKEY);
}

export { getToken, setToken, deleteToken };
