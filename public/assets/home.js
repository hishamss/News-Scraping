$(document).ready(() => {
  $.get("/all", (response) => {
    console.log(response);
  });
});
