/*
	url: 获取视频语音数据地址，
	height: 每项的高度，
	parentelem: 数据获取后新的列表项插入该元素下
*/
function getList(url, height, parentelem) {
	$('.loading').show();
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
	          parentelem.append(elem);
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

/*
	is_getting_list: 判断当前页面是否在加载新元素
*/
var is_getting_list = false;

Zepto(function($) {
  var ratio = 1280/720;
  var width = $('.list-container').width();
  var height = width / ratio;
  var json_num = 1;
  var json_video_num = 1;
  var json_voice_num = 1;
  var timer = 0;

  /*
	判断当前在直播页面还是回放页面
  */
  if ($('body').hasClass('live')) {
  	$(window).scroll(function() {
			console.log('scroll');
			if (!!timer) {
				return;
			}
			timer = setTimeout(function() {
				if (($(window).scrollTop() + $(window).height() + 100 > $(document).height()) && !is_getting_list) {
					is_getting_list = true;
					var json_url = 'adata' + json_video_num + '.json';
				  getList(json_url, height, $('.live-list-container'));
				  json_video_num += 1;
				}
				timer = 0;
			}, 250);
		}).trigger('scroll');
  }
  else if ($('body').hasClass('replay')) {
  	$(window).scroll(function() {
			if (!!timer) {
				return;
			}
			if ($('.replay_video_img').hasClass('replay_video_img2')) {
				timer = setTimeout(function() {
					if (($(window).scrollTop() + $(window).height() + 100 > $(document).height()) && !is_getting_list) {
						is_getting_list = true;
						var json_url = 'video' + json_voice_num + '.json';
					  getList(json_url, height, $('.video-list-container'));
					  json_voice_num += 1;
					}
					timer = 0;
				}, 250);
			} 
			else if ($('.replay_voice_img').hasClass('replay_voice_img2')) {
				timer = setTimeout(function() {
					if (($(window).scrollTop() + $(window).height() + 100 > $(document).height()) && !is_getting_list) {
						is_getting_list = true;
						var json_url = 'voice' + json_num + '.json';
					  getList(json_url, height, $('.voice-list-container'));
					  json_num += 1;
					}
					timer = 0;
				}, 250);
			}
		}).trigger('scroll');
  }
  $('.list-item').height(height);
});

/*
	直播页面点赞
*/
Zepto(function($) {
  $('.main-content-container').on('click', '.list-item-link', function(e) {
  	e.preventDefault();
    $(this).find('.image-container').toggleClass('praised');
	});
});


/*
	回放页面切换视频语音标签
*/
Zepto(function($) {
	$('#video').click(function(e){
		e.preventDefault();
		if ($('.replay_video_img').hasClass('replay_video_img2')) {	

		}
		else {
			$('#voice-container').hide();
			$('#video-container').show();
			$('.replay_video_img').addClass('replay_video_img2');
			$('.replay_voice_img').removeClass('replay_voice_img2');
		}
  });

  $('#voice').click(function(e){
  	e.preventDefault();
		if ($('.replay_voice_img').hasClass('replay_voice_img2')){

		}
		else{
				$('#video-container').hide();
				$('#voice-container').show();
				$('.replay_voice_img').addClass('replay_voice_img2');
				$('.replay_video_img').removeClass('replay_video_img2');			
		}
		if ($(this).hasClass('first-click')) {
  		$(this).removeClass('first-click');
  		$(window).trigger('scroll');
  	}
  });
});

/*
	获取验证码
*/
Zepto(function($) {
  $('.verify-btn').click(function(e) {
  	/* ui效果 */
  	e.preventDefault();
  	var duration = 90;
  	var start = new Date();
  	var startTime = start.getTime();
  	var process = setInterval(function() {
  		var current = new Date();
  		var currentTime = current.getTime();
  		var elapsedTime = Math.floor((currentTime - startTime) / 1000);
  		if (elapsedTime < duration) {
  			var btnText = (duration - elapsedTime) + 's后重新获取';
  		}
  		else {
  			clearInterval(process);
  			var btnText = '获取验证码';
  			$('.verify-btn').removeClass('verify-disabled');
  			$('.verify-btn').prop('disabled', false);
  			$('.verify-btn').removeAttr('style');
  		}
  		$('.verify-btn').html(btnText);
  	}, 250);
  	$(this).addClass('verify-disabled');
  	$('.verify-btn').prop('disabled', true);
  	$('.verify-btn').css('letter-spacing', '0px');

  	/* ajax请求发送验证码*/

  });

  /* 提交表单 */
  $('.submit-signup').click(function(e) {
  	e.preventDefault();
  	if (!$('.phone').val()) {
  		return;
  	}
  	if (!$('.verify').val()) {
  		return;
  	}
  	$('.submit-signup').prop('disabled', true);
  	$('.submit-signup').addClass('disabled');
  	$.ajax({
  		type: 'POST',
  		url: '',
  		data: {'phone': $('.phone').val(),
  			   'verify': $('.verify').val()},
  		timeout: 2000,
  		success: function(data) {
  			$('.signup-form').submit();
  			$('.submit-signup').prop('disabled', false);
  			$('.submit-signup').removeClass('disabled');
  		},
  		error: function(xhr, type) {
  			$('.mask').show();
  			setTimeout(function() {
  				$('.mask').hide();
  			}, 1200);
  			$('.submit-signup').prop('disabled', false);
  			$('.submit-signup').removeClass('disabled');
  		}
  	});
  });
});

function scrollToTop() {
	if (document.body.scrollTop!=0 || document.documentElement.scrollTop!=0){
		window.scrollBy(0,-80);
		var timeOut=setTimeout('scrollToTop()',10);
	}
	else clearTimeout(timeOut);
}

Zepto(function($){
    $(window).scroll(function(){
        if ($(window).scrollTop()>150){
            $(".backToTop").show();
        }
        else
        {
            $(".backToTop").hide();
        }
    });

    $(".backToTop").click(function(){
    	console.log('clickscroll');
    	scrollToTop();
        return false;
    });
});