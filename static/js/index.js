let customer = true;

function popup() {
  let text = document.getElementsByClassName("first")[0];
  let login_form = document.getElementsByClassName("form")[0];

  text.style.display = "none";
  login_form.style.display = "flex";
}

function create() {
  if (customer) {
    let text = document.querySelector(".create");
    text.innerHTML = "Log in";
    text.style.marginLeft = "210px";
    customer = false;
  } else {
    let text = document.querySelector(".create");
    text.innerHTML = "Create a Account";
    text.style.marginLeft = "142px";

    customer = true;
  }
}

async function create_acc() {
  let user = document.querySelector(".user").value;
  let pass = document.querySelector(".pass").value;
  let dataToSend = { user: user, pass: pass, customer: customer };

  if (user.length > 0 && pass.length > 0) {
    let result = await fetch("/handle_login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    }).then((response) => {
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        return response.json();
      }
    });
    if (result.is_user === 1) {
      window.alert("Wrong Password");
    } else if (result.is_user === 0) {
      window.alert("User does not exist");
    } else if (result.is_user === 2) {
      window.alert("User already exist Please login");
    }
  }
}
