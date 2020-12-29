let classes = {
  0: "Bronchiectasis",
  1: "Bronchiolitis",
  2: "COPD",
  3: "Healthy",
  4: "Pneumonia",
  5: "URTI",
};

$(document).ready(function() {
  $(".input-file").change(function() {
    $("#submit").click();
  });

  $('#uploadForm').submit(function() {
    document.getElementById("spinner").style.display = "block";	
    $(this).ajaxSubmit({
      error: function(xhr) {
        console.log("ERR!");
        document.getElementById("spinner").style.display = "none";	
      },

      success: function(response) {
        console.log(response);
        document.getElementById("spinner").style.display = "none";
        passParams(response.toString());
      }
    });
    return false;
  });
});

function passParams(data) {
      data = data.toString().replace("[", "").replace("]", "").split(",");
      console.log(data);

      document.getElementById("results").style.display = "block";
      for (let i = 0; i < 6; i++) {
        let className = `cat${i}`;
        let probName = `cat${i}prob`;
        document.getElementById(className).innerHTML = classes[i];
        document.getElementById(probName).innerHTML = data[i] + " %";
      }
}
