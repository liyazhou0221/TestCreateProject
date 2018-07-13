/**
 * 津贴计算
 */
$(document).ready(function(){
	//获取链接地址
	var host = getHost();
	//选择的营销系列
	var selection;
	//营销津贴规则:默认营销系列
	var allowanceRuleUrl =  host + "MarketingAllowanceCalculationRules.html";
	//选择的级别：默认为0（一级或A1级）
	var level = 0;
	
	initData();
	initListener();
	/**
	 *获取选择营销系列类型，显示不同的内容
	 */
	function initData(){
		var data = getRequest();
		if(data["selection"]==0){
			//营销:一级 二级
			selection = 0;
			allowanceRuleUrl = host + "MarketingAllowanceCalculationRules.html";
		}else{
		    $("#allowance_rule_li").html("ps:算法规则（业绩津贴=当月新契约业绩*<em id='allowance_rule_url' class='Performance-allowance'>提奖系数</em>）");
			//区拓：A1级 A2级
			allowanceRuleUrl = host + "AreaExtensionAllowanceCalculationRules.html";
			selection = 1;
			//显示不同的内容
			$("#level_select_ul label").each(function(index,item){
				if(index == 0){
					$(this).text("A1级");
				}else if(index ==1){
					$(this).text("A2级");
				}
			});
		}
	}
	/**
	 *添加点击事件监听
	 */
	function initListener(){
		//一级 二级|A1级 A2级
		$("#level_select_ul .checkbox_li").each(function(index,item){
			$(item).click(function(){
				level = index;
				//设置自己选中，其它不选中
				$(this).find(":checkbox").prop("checked",true);
				$(this).siblings().find(":checkbox").prop("checked",false);
				//如果输入框中有值，则输入结果也发生变化
				var fyc = $("#month_fyc_input").val();
				////startCalculation();
				$("#out_content_div").hide();
			});
		});
		//津贴规则
		$("#allowance_rule_url").click(function(){
			window.location.href= allowanceRuleUrl;
		});
		//需要计算的当月金额值
		$("#month_fyc_input").bind("input",function(){
			//startCalculation();
			$("#out_content_div").hide();
		});
		//需要计算的当月金额值
		$("#stard_calculation").bind("click",function(){
			startCalculation();
			$("#out_content_div").show();
			$("#input_content_div").hide();
		});
		//重新计算：显示输入内容
		$("#re_stard_calculation").bind("click",function(){
			$("#out_content_div").hide();
			$("#input_content_div").show();
		});
		//返回
		$(".header-left").bind("click",function(){
			history.go(-1);
		});
	}
	
	/**
	 *获取url中传值
	 */
	function getRequest() {
		//获取url中"?"符后的字串
		var url = location.search; 
		console.log(url);
		var theRequest = new Object();
		if (url.indexOf("?") != -1) {
			//去掉？后剩下的值
			var str = url.substr(1);
			//按照&分组后的数组
			var strs = str.split("&");
			var valueMapArr;
			for(var i = 0; i < strs.length; i ++) {
				valueMapArr = strs[i].split("=");
				theRequest[valueMapArr[0]]=unescape(valueMapArr[1]);
			}
		}
		console.log(theRequest);
		return theRequest;
	}
	/**
	 *开始计算
	 **/
	function startCalculation(){
		var fyc = $("#month_fyc_input").val();
		fyc = new Number(fyc);
		//区分销售系列：营销和区拓
		//业绩津贴
		var allowance ;
		//需要显示的提示内容
		var marketingTable = "";
		var areaTable = "";
		//显示可拿到的津贴
		//根据业务级别和当月业绩 展示不同的提醒内容
		if(selection == "0"){
			//营销
			allowance = getAllowanceByLevelAndFYC(level,fyc);
			marketingTable = getAllowanceTableDetail(level,fyc);
			$("#marketing_table tbody").html(marketingTable);
			$("#marketing_table").show();
		}else {
			//区拓
			allowance = getAreaAllowanceByLevelAndFYC(level,fyc);
			areaTable = getAreaAllowanceTableDetail(level,fyc);
			$("#extra_table tbody").html(areaTable);
			$("#extra_table").show();
		}
		$("#allowance_result").text(allowance);
		$("#allowance_result_div").show();
		$("#disparity_result_div").show();
		if(allowance > 0){
			var coin=new Coin();	
		}
	}
	//一级业务员获取津贴比例
	var levelClerkProportion = [0,0.08,0.15,0.20,0.22];
	var secondaryClerkProportion = [0,0.05,0.1,0.15,0.2];
	var levelClerk = [levelClerkProportion,secondaryClerkProportion];
	/**业务员：clerk
	  *根据业务级别和当月业绩 计算当月可获取到的津贴
	  *业绩津贴 = 当月FYC * 业绩津贴比例
	*/
	function getAllowanceByLevelAndFYC(level,fyc){
		var allowance = 0;
		var clerkProportion = levelClerk[level];
		if(fyc < 1500){
			allowance = 0;
		}else if(fyc >= 1500 && fyc < 2500){
			allowance = fyc * clerkProportion[1];
		}else if(fyc >= 2500 && fyc < 3500){
			allowance = fyc * clerkProportion[2];
		}else if(fyc >= 3500 && fyc < 6000){
			allowance = fyc * clerkProportion[3];
		}else if(fyc >= 6000){
			allowance = fyc * clerkProportion[4];
		}
		return allowance.toFixed(2);
	}
	//一级业务员获取津贴比例
	var levelClerkProportionA1 = [0,0.028,0.053,0.07,0.077];
	var secondaryClerkProportionA2 = [0,0.018,0.035,0.053,0.07];
	var levelClerkArea = [levelClerkProportionA1,secondaryClerkProportionA2];
	/**收展员
	  *根据业务级别和当月业绩 计算当月可获取到的津贴
	  *业绩津贴 = 当月FYC * 业绩津贴比例
	*/
	function getAreaAllowanceByLevelAndFYC(level,fyc){
		var allowance = 0;
		var clerkProportion = levelClerkArea[level];
		if(fyc < 4000){
			allowance = 0;
		}else if(fyc >= 4000 && fyc < 7200){
			allowance = fyc * clerkProportion[1];
		}else if(fyc >= 7200 && fyc < 10000){
			allowance = fyc * clerkProportion[2];
		}else if(fyc >= 10000 && fyc < 17000){
			allowance = fyc * clerkProportion[3];
		}else if(fyc >= 17000){
			allowance = fyc * clerkProportion[4];
		}
		return allowance.toFixed(2);
	}
	/**
	 *获取营销获取对应的表格结果
	 */
	function getAllowanceTableDetail(level,fyc){
		var value = 0;
		var levelClerkVal = 0;
		var clerkProportion = levelClerk[level];
		var haveReached = "<td>已达标</td><td>--</td><td>--</td><td>--</td>";
		var html = "" ;
		    //1500-2500
			html +="<tr><td>1500-2500</td>";
				if(fyc >= 1500){
					html += haveReached;
				}else{
					value = 1500 * clerkProportion[1];
					value = value.toFixed(0);
					levelClerkVal = 100 * clerkProportion[1];
					levelClerkVal = levelClerkVal.toFixed(1);
					html += "<td>1500</td><td>"+(1500 - fyc)+"</td><td>"+levelClerkVal+"%</td><td>"+value+"</td>";
				}
			html += "</tr>";
			//2500-3500
			html +="<tr><td>2500-3500</td>";
				if(fyc >= 2500){
					html += haveReached;
				}else{
					value = 2500 * clerkProportion[2];
					value = value.toFixed(0);
					levelClerkVal = 100 * clerkProportion[2];
					levelClerkVal = levelClerkVal.toFixed(1);
					html += "<td>2500</td><td>"+(2500 - fyc)+"</td><td>"+levelClerkVal+"%</td><td>"+value+"</td>";
				}
			html += "</tr>";
			//3500-6000
			html +="<tr><td>3500-6000</td>";
				if(fyc >= 3500){
					html += haveReached;
				}else{
					value = 3500 * clerkProportion[3];
					value = value.toFixed(0);
					levelClerkVal = 100 * clerkProportion[3];
					levelClerkVal = levelClerkVal.toFixed(1);
					html += "<td>3500</td><td>"+(3500 - fyc)+"</td><td>"+levelClerkVal+"%</td><td>"+value+"</td>";
				}
			html += "</tr>";
			//6000
			html +="<tr><td>6000以上</td>";
				if(fyc >= 6000){
					html += haveReached;
				}else{
					value = 6000 * clerkProportion[4];
					value = value.toFixed(0);
					levelClerkVal = 100 * clerkProportion[4];
					levelClerkVal = levelClerkVal.toFixed(1);
					html += "<td>6000</td><td>"+(6000 - fyc)+"</td><td>"+levelClerkVal+"%</td><td>"+value+"</td>";
				}
			html += "</tr>";
		return html;
	}
	/**
	 *获取区拓获取对应的表格结果
	 */
	function getAreaAllowanceTableDetail(level,fyc){
		var value = 0;
		var levelClerkVal = 0;
		var clerkProportion = levelClerkArea[level];
		var haveReached = "<td>已达标</td><td>--</td><td>--</td><td>--</td>";
		var html = "" ;
		    //4000-7200
			html +="<tr><td>4000-7200</td>";
				if(fyc >= 4000){
					html += haveReached;
				}else{
					value = 4000 * clerkProportion[1];
					value = value.toFixed(0);
					levelClerkVal = 100 * clerkProportion[1];
					levelClerkVal = levelClerkVal.toFixed(1);
					html += "<td>4000</td><td>"+(4000 - fyc)+"</td><td>"+levelClerkVal+"%</td><td>"+value+"</td>";
				}
			html += "</tr>";
			//7200-10000
			html +="<tr><td>7200-10000</td>";
				if(fyc >= 7200){
					html += haveReached;
				}else{
					value = 7200 * clerkProportion[2];
					value = value.toFixed(0);
					levelClerkVal = 100 * clerkProportion[2];
					levelClerkVal = levelClerkVal.toFixed(1);
					html += "<td>7200</td><td>"+(7200 - fyc)+"</td><td>"+levelClerkVal+"%</td><td>"+value+"</td>";
				}
			html += "</tr>";
			//10000-17000
			html +="<tr><td>10000-17000</td>";
				if(fyc >= 10000){
					html += haveReached;
				}else{
					value = 10000 * clerkProportion[3];
					value = value.toFixed(0);
					levelClerkVal = 100 * clerkProportion[3];
					levelClerkVal = levelClerkVal.toFixed(1);
					html += "<td>10000</td><td>"+(10000 - fyc)+"</td><td>"+levelClerkVal+"%</td><td>"+value+"</td>";
				}
			html += "</tr>";
			//17000
			html +="<tr><td>17000以上</td>";
				if(fyc >= 17000){
					html += haveReached;
				}else{
					value = 17000 * clerkProportion[4];
					value = value.toFixed(0);
					levelClerkVal = 100 * clerkProportion[4];
					levelClerkVal = levelClerkVal.toFixed(1);
					html += "<td>17000</td><td>"+(17000 - fyc)+"</td><td>"+levelClerkVal+"%</td><td>"+value+"</td>";
				}
			html += "</tr>";
		return html;
	}
});









