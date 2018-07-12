/**
 * Created by Administrator on 2016/5/23.
 */
 


//$(document).ready(function(){
//		$('#business_handle').width(document.body.clientWidth);
//		$('#business_query').width(document.body.clientWidth);
//	});




/* 双系统合成首页切换效果 */
	var array1 = ["首页","推荐","收藏","设置"];
	var headerTit = document.getElementById("title")
	headerTit.innerHTML = "首页";
	
	var tabsSwiper = new Swiper('.swiper-container',{
		speed:0,
	 onSlideChangeStart: function(){
			var viewIndex = tabsSwiper.activeIndex;
			$(".tabs .active").removeClass('active');
			$(".tabs div").eq(viewIndex).addClass('active');
			
			var headerTit = document.getElementById("title");
			if (viewIndex == 0) {
				headerTit.innerHTML = array1[viewIndex];
				
				
			}
			if(viewIndex == 1){
				headerTit.innerHTML = array1[viewIndex];
			}
			if (viewIndex == 2) {
				headerTit.innerHTML = array1[viewIndex];
			}
			else{
				headerTit.innerHTML = array1[viewIndex];
			}
			}
		}
	)
	
	$(".tabs div").on('touchstart mousedown',function(e){
		e.preventDefault();
		$(".tabs .active").removeClass('active');
		$(this).addClass('active');
		tabsSwiper.swipeTo( $(this).index() );
	})
	$(".tabs div").click(function(e){
		e.preventDefault()
	})




/* 背景变暗显示弹框效果 */
		function showDiv(){
		document.getElementById('popDiv').style.display='block';
		document.getElementById('popIframe').style.display='block';
		document.getElementById('bg').style.display='block';
		}
		function closeDiv(){
		document.getElementById('popDiv').style.display='none';
		document.getElementById('bg').style.display='none';
		document.getElementById('popIframe').style.display='none';
		}




/* 业务办理、业务查询页面顶部标题切换效果 */
	function test(type){
			if(type ==1){
				$("#business_query").show()
				$("#business_handle").hide()
				$("#query").css({"color":"#008ce9","background": "#FFF"});
				$("#handle").css({"color":"#808080","background": "#f6f6f6"});
				}else{
				$("#business_handle").show();
				$("#business_query").hide();
				$("#query").css({"color":"#808080","background": "#f6f6f6"});
				$("#handle").css({"color":"#008ce9","background": "#FFF"});
			}
	}


/* 更换更新内容 */
	function changeText(){
		var isUpdate = document.getElementById('is_update').value;
		if('true' == isUpdate){
			document.getElementById('popDiv').style = 'display:none;';
			closeDiv();
			reset();
			return;
		}
		document.getElementById('update_cont').innerHTML = '您处于数据网络，是否更新？';
		document.getElementById('is_update').value = 'true';
	}
	function reset(){
		document.getElementById('is_update').value = 'false';
		document.getElementById('update_cont').innerHTML = '版本更新3.2，更新包大小：10M。';
	}
/* 还原更新内容 */
	function restoreText(){
		document.getElementById('update_cont').innerHTML = '版本更新3.2，更新包大小：10M。';
	}














