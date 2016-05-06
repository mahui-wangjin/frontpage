function getList(url, height) {
	$.ajax({
    	type: 'GET',
    	url: url,
    	dataType: 'json',
    	success: function(data) {
    		$('.loading').hide();
    		if (data) {
	    		for(i = 0; i < data.length; i++) {
	    			console.log(data[i].video_url);
	    			var praisedClass = data[i].user_praised === true ? 'praised' : '';
		    		var str = '<div class="list-item" style="background-image:url(../img/'
		    			+ data[i].image
		    			+ ')"><a class="video-link" href="'
						+ data[i].video_url
						+ '"></a>'
						+ '<div class="list-caption"><div class="logo-container"><div class="image-container"></div></div><div class="nice-container"><a href="#" class="list-item-link"><div class="image-container '
						+ praisedClass
						+ '"></div></a></div><div class="details-container"><div class="details-header">'
		    			+ data[i].title 
		    			+ '</div><div class="details-plot"><div class="read"><div class="read-icon"></div><div class="read-num">'
		    			+ data[i].view
		    			+ '</div></div><div class="praise"><div class="praise-icon"></div><div class="praise-num">'
		    			+ data[i].praise_num
		    			+ '</div></div><div class="published"><div class="published-icon"></div><div class="published-date">'
		                + data[i].date
		                + '</div></div></div></div></div></div>';
		            var elem = $(str);
		            $('.list-container').append(elem);
		            $('.list-item').height(height);
		    	}
	    	}
	    	is_getting_list = false;
    	},
    	error: function(xhr, type) {
    		$('.loading').hide();
    		is_getting_list = false;
    		console.log('nomore');
    	}
    });
}

var is_getting_list = false;

Zepto(function($) {
    var ratio = 1280/720;
    var width = $('.list-container').width();
    var height = width / ratio;

    var json_num = 1;
    var json_url = 'adata' + json_num + '.json';
    getList(json_url, height);
    json_num += 1;
    
	$(window).scroll(function() {
		if (($(window).scrollTop() + $(window).height() + 100 > $(document).height()) && !is_getting_list) {
			is_getting_list = true;
			var json_url = 'adata' + json_num + '.json';
		    getList(json_url, height);
		    json_num += 1;
		}
	});

    $('.list-item').height(height);
});

Zepto(function($) {
    $('.main-content-container').on('click', '.list-item-link', function(e) {
    	e.preventDefault();
	    $(this).find('.image-container').toggleClass('praised');
	});
});