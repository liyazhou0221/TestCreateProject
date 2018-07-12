配置服务器时需要重新设置，避免页面刷新时，客户端存在缓存无法跟新到最新文件，不需要时可以设置为空
biz/common/config.js 中返回的host地址
如：
function getHost(){
	 return "http://47.95.113.53:8080/project/";
}