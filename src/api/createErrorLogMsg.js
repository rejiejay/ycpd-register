import config from "./../config/index";

/**
 * 输出一下日志
 */
let createErrorLogMsg = msg => {
	$.get(`${config.url.origin2}/Customer/CreateErrorLog`, {Msg: msg}, 
	function(response, status, xhr) {
		console.log(`成功输入日志, ${msg}`);
	});
}

export default createErrorLogMsg
