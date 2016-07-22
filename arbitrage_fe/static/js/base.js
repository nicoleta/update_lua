
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
csrftoken = getCookie('csrftoken');


function unescapeHtml(safe) {
    return safe
    	 .replace(/<br\s*[\/]?>/gi, "\n")
         .replace(/&amp;/g, "&")
         .replace(/&lt;/g, "<")
         .replace(/&gt;/g, ">")
         .replace(/&quot;/g, "\"")
         .replace(/&#039;/g, "'");
 }


$(document).ready(function(){

	var luaTextArea = document.getElementById("id_lua_editor")
	
	var myCodeMirror = CodeMirror.fromTextArea(luaTextArea, {
  		mode:  "lua",
  		lineNumbers: true
	});
	myCodeMirror.setSize(800, 700);
	
	current_script_id = null;

	 $(".edit_script").click(function(){
  		current_script_id = $(this).attr('id').split("_")[1];
  		myCodeMirror.setValue(unescapeHtml(all_scripts[current_script_id]['code']));
  		$('#id_script_name').val(all_scripts[current_script_id]['name']);
	 });
	
	 $(".remove_script").click(function() {
	 	if (!confirm("Are you sure?"))
	 		return
  		var s_id = $(this).attr('id').split("_")[1];
  		params = JSON.stringify({'id': s_id})

  		$.ajax({
                type: "POST",
                url: "/remove_script/",
                contentType: "application/json",
                data: params,
                beforeSend: function(xhr, settings) {
			        xhr.setRequestHeader("X-CSRFToken", csrftoken);
			    }
            })
            .success(function(d, textStatus, response) {
            	window.location.reload();
            })
            .error(function(response, textStatus) {
               alert("Error. Check console.");
               console.debug(response);
            });
	 });

	 $('.save_button').click(function(e) {
 	 	var action = $(this).attr('id');

	 	var code = myCodeMirror.getValue();
	 	var name = $('#id_script_name').val().trim();
	 	var id = current_script_id;
	 	
	 	if (name=="" || code=="") {
		 	alert("Name and code cannot be empty");
		 	return;
		 }

	 	if (action == "id_create_button") {
		 	var unique = true;
		 	for(var k in all_scripts) {
		 		if(name == all_scripts[k]['name']){
		 			unique = false;
		 			break
		 		}
		 	}
		 	if (! unique) {
		 		alert("Script name already exists");
		 		return;
		 	}
		 	var id = null;
	 	}
	 	var params = {
 			"id": id,
 			"code": code,
 			"name": name
 		};
 		params = JSON.stringify(params)
 
		$.ajax({
                type: "POST",
                url: "/save_script/",
                contentType: "application/json",
                data: params,
                beforeSend: function(xhr, settings) {
			        xhr.setRequestHeader("X-CSRFToken", csrftoken);
			    }
            })
            .success(function(d, textStatus, response) {
            	window.location.reload();
            })
            .error(function(response, textStatus) {
               alert("Error. Check console.");
               console.debug(response);
            });
 	 });
});

