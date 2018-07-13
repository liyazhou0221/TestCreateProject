/**
 * 入围差距提醒
 */
$(document).ready(function(){
	
	//选择的营销系列
	var selection;

	var first_month_fyc = 0;
	var first_month_piece  = 0;
	var second_month_fyc = 0;
	var second_month_piece  = 0;	
	var third_month_fyc = 0;
	var third_month_piece  = 0;
	//需要显示的信息
	var resultMsg1 ;
	var resultMsg2 ;
	//达到的级别
	var achieveLevel = "";
	/**
	 *初始化
	 **/
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
			$("#title").text("业务员入围差距提醒");
		}else{
			//区拓：A1级 A2级
			selection = 1;
			$("#title").text("收展员入围差距提醒");
			//修改页面gyc值提示信息：展业业绩
			$("#first_month_fyc").attr("placeholder","展业业绩");
			$("#second_month_fyc").attr("placeholder","展业业绩");
			$("#third_month_fyc").attr("placeholder","展业业绩");
			$("#result_tip_label").html("<i class='fa fa-leaf'></i>若您在本季度达标，下季度每月展业业绩会有如下津贴奖励哦！");
		}
	}
	/**
	 *添加点击事件监听
	 */
	function initListener(){
		//需要计算的当月金额值
		$("#result_btn").bind("click",function(){
			var congratulations = "恭喜恭喜，您已达成";
			var levelMsg = "";
			//重置达到的级别
			achieveLevel = "";
			getPageValue();
			//区分销售系列：营销和区拓
			resultMsg1 = "";
			resultMsg2 = "";
			if(selection == "0"){
				//营销
				levelMsg = "业务员";
				getMarketLevelByFYCAndPiece();
				$("#area_table_detail").hide();
				$("#marketing_table_detail").show();
			}else {
				//区拓
				levelMsg = "收展员";
				getAreaLevelByFYCAndPiece();
				$("#area_table_detail").show();
				$("#marketing_table_detail").hide();
			}
			console.log(resultMsg1 + "__" + resultMsg2);
			if(resultMsg1){
				$("#calculation_result_li_1").html("<i class='fa fa-gift fa-color-red'></i>" + resultMsg1);
			}
			if(resultMsg2){
				$("#calculation_result_li_2").html("<i class='fa fa-gift fa-color-red'></i>" + resultMsg2);
				$("#calculation_result_li_2").show();
			}else{
				$("#calculation_result_li_2").hide();
			}
			//隐藏输入值，显示结果值
			$("#input_content_div").hide();
			$("#out_content_div").show();
			//根据达到的级别显示效果GIF：效果不太好，取消展示
			/**
			if(achieveLevel != ""){
				$("#congratulations_input").text(congratulations + achieveLevel + levelMsg);
				console.log($("#congratulations_input").text());
				addGIFAnimation();
				var interval = setInterval(function(){
					console.log("关闭计时器");
					removeGIFAnimation();
					clearInterval(interval) ;
				},5000) ;
			}**/
		});
		//返回
		$(".header-left").bind("click",function(){
			history.go(-1);
		});
		//点击弹出框消失
		$(".bg-sigh").click(function () {
			$("#sign-kuang").hide();
		});
		//页面重置
		$("#reset_content_btn").bind("click",function(){
			$("#input_content_div").show();
			$("#out_content_div").hide();
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
			//去掉?后剩下的值
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
	 * 获取页面参数值
	 */
	function getPageValue(){
		first_month_fyc = $("#first_month_fyc").val();
		first_month_piece = $("#first_month_piece").val();
		
		second_month_fyc = $("#second_month_fyc").val();
		second_month_piece = $("#second_month_piece").val();
		
		third_month_fyc = $("#third_month_fyc").val();
		third_month_piece = $("#third_month_piece").val();
		
		first_month_fyc = new Number(first_month_fyc);
		first_month_piece = new Number(first_month_piece);
		
		second_month_fyc = new Number(second_month_fyc);
		second_month_piece = new Number(second_month_piece);
		
		third_month_fyc = new Number(third_month_fyc);
		third_month_piece = new Number(third_month_piece);
	}
	/**
	 *营销：
	 *一级：3件  FYC 4000 或 2件  FYC 6000
	 *二级：2件  FYC 3000
	 **/
	var m1Piece1 = 3;
	var m1Piece2 = 2;
	var m1FYC1 = 4000;
	var m1FYC2 = 6000;
	var m2Piece = 2;
	var m2FYC = 3000;
	function getMarketLevelByFYCAndPiece(){
		var resultMsg = "";
		//月均件数：总件数 除 3
		var pieceSum = first_month_piece + second_month_piece + third_month_piece;
		var piece = pieceSum / 3;
		//月均FYC = 总FYCF 除 3
		var fycSum = first_month_fyc + second_month_fyc + third_month_fyc;
		var fyc = fycSum / 3;
		//一级：2件  FYC 6000
		if(m1FYC2 <= fyc && piece >= m1Piece2){
			achieveLevel = "一级";
			resultMsg1 ="<em>恭喜达成一级</em>";
		}
		//一级：3件  FYC 4000
		else if(m1FYC1 <= fyc && piece >= m1Piece1){
			achieveLevel = "一级";
			resultMsg1 ="<em>恭喜达成一级</em>";
		}
		//二级：2件  FYC 3000
		else if(m2FYC <= fyc  && piece >= m2Piece){
			achieveLevel = "二级";
			resultMsg1 ="<em>恭喜达成二级</em>";
			resultMsg2 =getFirstLevelDisparity(piece,pieceSum,fyc,fycSum);
		}else{
			resultMsg1 =getSecondLevelDisparity(piece,pieceSum,fyc,fycSum);
			resultMsg2 =getFirstLevelDisparity(piece,pieceSum,fyc,fycSum);
		}
	}
	//获取一级差距
	function getFirstLevelDisparity(piece,pieceSum,fyc,fycSum){
		var piece1 = (piece < m1Piece1 ? (m1Piece1 * 3 - pieceSum) : 0);
		var fyc1 = (fyc < m1FYC1 ? (m1FYC1 * 3 - fycSum):0);
		var piece2 = (piece < m1Piece2 ? (m1Piece2*3 - pieceSum) : 0);
		var fyc2 = (fyc < m1FYC2 ? (m1FYC2*3 - fycSum): 0);
		//FYC达标时，只显示件数最小值
		if(fyc1 == fyc2 && fyc1== 0){
			return "距离一级差距为：<em>件数：" +(piece1 > piece2 ? piece2:piece1) + "件，FYC：0元</em>";
		}
		return  "距离一级差距为：<em>"
			+"件数："+(piece1 == 0 ?"0":  piece1) +"件，"
			+"FYC："+(fyc1 == 0 ?"0": fyc1)+"元"
			+"</em>或<em>"
			+"件数："+(piece2 == 0 ?"0":   piece2)+ "件，"
			+"FYC："+(fyc2 == 0 ?"0": fyc2) +  "元</em>";
	}
	//获取二级差距
	function getSecondLevelDisparity(piece,pieceSum,fyc,fycSum){
		return "距离二级差距为：<em>" 
				+"件数："+ (piece < m2Piece ? (m2Piece * 3 - pieceSum) : "0")+ "件，"
				+"FYC："+(fyc < m2FYC ? (m2FYC * 3 - fycSum):"0") + "元</em>";
	}
	/**
	 *区拓
	 *A1级：3件  FYC 34000 或 2件  FYC 54000
	 *A2级：2件  FYC 25000
	 */
	var a1Piece1 = 3;
	var a1Piece2 = 2;
	var a1FYC1 = 34000;
	var a1FYC2 = 54000;
	var a2Piece = 2;
	var a2FYC = 25000;
	/**
	 * 区拓：季度累计
	 **/
	function getAreaLevelByFYCAndPiece(){
		var resultMsg = "";
		//月均件数：总件数 除 3
		var pieceSum = first_month_piece + second_month_piece + third_month_piece;
		var piece = pieceSum / 3;
		//季度累计 fyc == fycSum
		var fycSum = first_month_fyc + second_month_fyc + third_month_fyc;
		var fyc = fycSum ;
		//A1级：2件  FYC 54000
		if(a1FYC2 <= fyc && piece >= a1Piece2){
			resultMsg1 ="<em>恭喜达成A1级</em>";
			achieveLevel = "A1级";
		}
		//A1级：3件  FYC 34000
		else if(a1FYC1 <= fyc  && piece >= a1Piece1){
			resultMsg1 ="<em>恭喜达成A1级</em>";
			achieveLevel = "A1级";
		}
		//A2级：2件  FYC 25000
		else if(a2FYC <= fyc && piece >= a2Piece){
			resultMsg1 ="<em>恭喜达成A2级</em>";
			achieveLevel = "A2级";
			resultMsg2 =getA1Disparity(piece,pieceSum,fyc,fycSum);
		}else{
			resultMsg1 =getA2Disparity(piece,pieceSum,fyc,fycSum);
			resultMsg2 =getA1Disparity(piece,pieceSum,fyc,fycSum);
		}
	}
	//获取差距A1
	function getA1Disparity(piece,pieceSum,fyc,fycSum){
		var piece1 = (piece < a1Piece1 ? (a1Piece1 * 3 - pieceSum): 0);
		var fyc1 = (fyc < a1FYC1 ? (a1FYC1- fycSum):0);
		var piece2 = (piece < a1Piece2 ? (a1Piece2*3 - pieceSum) : 0);
		var fyc2 = (fyc < a1FYC2 ? (a1FYC2 - fycSum): 0);
		//FYC达标时，只显示件数最小值
		if(fyc1 == fyc2 && fyc1== 0){
			return "距离A1级差距为：<em>件数：" + (piece1 > piece2 ? piece2:piece1) + "件，展业业绩：0元</em>";
		}
		return  "距离A1级差距为：<em>"
			+"件数："+(piece1 == 0 ? "0": piece1) + "件，"
			+"展业业绩："+(fyc1 == 0 ? "0": fyc1)+ "元"
			+"</em>或<em>"
			+"件数："+(piece2 == 0 ? "0": piece2) + "件，"
			+"展业业绩："+(fyc2 == 0 ? "0": fyc2) + "元</em>";
	}
	//获取差距A2
	function getA2Disparity(piece,pieceSum,fyc,fycSum){
		return "距离A2级差距为：<em>" 
				+"件数："+(piece < a2Piece ? (a2Piece * 3 - pieceSum): "0") + "件，"
				+"展业业绩："+(fyc < a2FYC ? (a2FYC - fycSum) :"") + "元</em>";
	}
	
	
    //添加动画
	function addGIFAnimation(){
		console.log("显示动画");
		$("#congratulations_div").show(1000);
	}
	//清除动画
	function removeGIFAnimation(){
		console.log("清除动画");
		$("#congratulations_div").hide(1000);
	}
	
	//一级业务员获取津贴比例
	/**var levelClerkProportion = [0,0.08,0.15,0.20,0.22];
	var secondaryClerkProportion = [0,0.05,0.1,0.15,0.2];
	var levelClerk = [levelClerkProportion,secondaryClerkProportion];
	业务员：clerk
	  *根据业务级别和当月业绩 计算当月可获取到的津贴
	  *业绩津贴 = 当月FYC * 业绩津贴比例
	
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
	}*/
	//一级业务员获取津贴比例
	/**var levelClerkProportionA1 = [0,0.028,0.053,0.07,0.077];
	var secondaryClerkProportionA2 = [0,0.018,0.035,0.053,0.07];
	var levelClerkArea = [levelClerkProportionA1,secondaryClerkProportionA2];
	收展员
	  *根据业务级别和当月业绩 计算当月可获取到的津贴
	  *业绩津贴 = 当月FYC * 业绩津贴比例
	
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
	}*/
});









