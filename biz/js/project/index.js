/**
 * 首页
 */
$(document).ready(function(){
	//获取链接地址
	var host = getHost();
	//选择的销售系列
	var selection;
	//选择的具体功能
	var option;
	$(".push-left p").click(function () {
		$("#option_dialog").show(300)
	})
	//功能选择
	$("#marketing_series_select div").each(function(index,item){
		$(item).click(function () {
			selection = index;
			$("#option_dialog").show(300);
		});
	});
	//功能选择
	$("#option_dialog a").each(function(index,item){
		$(item).click(function () {
			var url = "";
			if(index == 0){
				//津贴计算
				url = 'AllowanceCalculation.html?selection='+selection;
			}else{
				//入围差距提醒
				url = 'FinalistGapReminder.html?selection='+selection;
			}
			window.open(host + url,'_self');
			$("#option_dialog").hide(300);
		});
	});
	
});









