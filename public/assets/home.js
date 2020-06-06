$(document).ready(() => {
  $.get("/all", (response) => {
    console.log(response);
    for (row of response) {
      $(".articles").append(
        `<div class="col mt-3 mb-3 rounded">
        <div class="card aritcleCard">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-9">
                        <h5 class=" card-title"><a href="${row.link}" target="_blank">${row.headline}</a>
                        </h5>
                        <p class="card-text">${row.description}</p>
                    </div>
                    <div class="col-md-3"><img class="img-fluid aritcleImg" src="${row.img}"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="w-100"></div>`
      );
    }
  });
});
