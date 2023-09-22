class User {}
const users = [
  { email: "user1@example.com", password: "password1", name: "User 1" },
  { email: "user2@example.com", password: "password2", name: "User 2" },
  // Add more users as needed
];

const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  validateInputs();
});

const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = message;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};

const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = "";
  inputControl.classList.add("success");
  inputControl.classList.remove("error");
};

const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validateInputs = () => {
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  const user = users.find(
    (user) => user.email === emailValue && user.password === passwordValue
  );

  if (user) {
    message.innerText = `ברוך הבא למערכת, ${user.name}!`;
    setSuccess(email);
    setSuccess(password);
  } else {
    setError(email, "פרטים לא נכונים");
    setError(password, "פרטים לא נכונים");
  }
};
