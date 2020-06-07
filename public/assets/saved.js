$(document).ready(() => {
  $("#clearSavedLnk").on("click", () => {
    $.ajax({
      url: "/clearSaved",
      type: "DELETE",
      success: function (result) {
        console.log(result);
      },
    });
  });
});
