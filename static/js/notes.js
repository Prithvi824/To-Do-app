let owner = document.querySelector(".name");
let pencil = document.querySelector(".bx.bx-edit");
let trash = document.querySelector(".bx.bxs-trash");
let save = document.querySelector(".bx.bxs-save");
let edit_para = document.querySelector(".specific_note");
let card = document.querySelector(".content");
let bar = document.querySelector(".bar");
let add_btn = document.querySelector(".add");
let specific = document.querySelector(".specific");
let specific_head = document.querySelector(".specific_head");
let specific_note = document.querySelector(".specific_note");
let close_btn = document.querySelector(".bx.bx-x");

owner.innerHTML = `${user}'s Notes`;


let add_note = document.querySelector(".add");
add_note.addEventListener("click", () => {
  opencard(null, true);
});

let parent = document.querySelector(".content");
let data = info;
let keys = Object.keys(data);

for (let i = 0; i < keys.length; i++) {
  parent.innerHTML += `
    <div class="card">
    <img src="/static/images/clip.png" alt="" class="clip" />
    <div class="paper_card" id="${i}" onclick="opencard(${i})" heading_id="${data[keys[i]]['_id']}">
      <p class="heading">${keys[i]}</p>
      <p class="para_content">${data[keys[i]]['body']}</p>
    </div>
  </div>`;
}

function opencard(note_id, create=false) {
  card.style.display = "none";
  add_btn.style.display = "none";
  bar.style.display = "none";
  specific.style.display = "flex";
  close_btn.style.display = "inline";
  specific_head.style.display = "block";
  specific_note.style.display = "block";

  if (!create){
  let heading = keys[note_id];
  let paragraph = data[heading]['body'];

  specific_head.innerHTML = heading;
  specific_note.innerHTML = paragraph;}
  else {
    specific_head.innerHTML = "Remove this from the heading";
    specific_note.innerHTML = 'Add Your content here';
  }
}

pencil.addEventListener("click", () => {
  edit_para.contentEditable = "true";
  specific_head.contentEditable = 'true';
  trash.style.display = "none";
  save.style.display = "inline";
  close_btn.style.display = "none";
});

save.addEventListener("click", () => {
  edit_para.contentEditable = "false";
  specific_head.contentEditable = 'false';

  trash.style.display = "inline";
  save.style.display = "none";
  close_btn.style.display = "inline";
  let head = document.querySelector(".specific_head").innerHTML;
  let para = edit_para.innerHTML;
  let heading_id = document.querySelector(".specific_head")?.getAttribute("heading_id") ?? null;


  fetch(`${user}/save_note`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      'head': head,
      'para': para,
      'heading_id': heading_id
    }),
  });
});

trash.addEventListener("click", () => {
  fetch(`${user}/trash`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      'key':  document.querySelector(".paper_card").getAttribute("heading_id")
    }),
  });
  window.location = `/${user}`
});

close_btn.addEventListener("click", () => {
  window.location = `/${user}`;
});
