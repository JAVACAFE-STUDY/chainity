var httpStatus = require('http-status');
var APIError = require('../helpers/APIError');
var config = require('../config/config');
var axios = require('axios');
var qs = require('qs');


const getUnique = function() {
	var date = new Date();
	
	var year = date.getFullYear(); // 연도
	var month = new String(date.getMonth()+1); // 월
	var day = new String(date.getDate()); // 일
	var hour = new String(date.getHours()); // 시
	var minute = new String(date.getMinutes()); // 분
	var second = new String(date.getSeconds()); // 초
	var mlSecond = new String(date.getMilliseconds());
	
	// 구한 값들이 10보다 작으면 숫자 앞에 "0"을 추가한다.
	if(month < 10){
		month = "0" + month;
	}
	
	if(day < 10){
		day = "0" + day;
	}
	
    if(hour < 10){
    	hour = "0" + hour;
	}
    
	if(minute < 10){
		minute = "0" + minute;
	}
		
    if(second < 10){
    	second = "0" + second;
	}
    
  var result = {
    isTuno: year + month + day + hour + minute + second + mlSecond +"001",
    tsymd: year + month + day,
    trtm: hour + minute + second
  };
  return result;
}

/**
 * Post Transfer
 * @param {string} req.body.value - value for transfer.
 * @param res
 * @param next
 * @returns {*}
 */
function drawTransfer(req, res, next) {

  var unique = getUnique();
  var tram = req.body.value || 10;
  var finAcno = req.body.finAccount || config.bank.nh.account;
  
  var inputJson = {
    Header: {
      ApiNm: 'DrawingTransfer',           // API코드
      Tsymd: unique.tsymd,                // 전송일자
      Trtm: unique.trtm,                  // 전송시각
      Iscd: '000020',                     // 기관코드
      FintechApsno: '001',                // 핀테크앱일련번호
      ApiSvcCd: '01D_001_00',             // API서비스코드 
      IsTuno: unique.isTuno               // 기관거래고유번호
    },
    FinAcno: finAcno,                     // 핀-어카운트
    Tram: '2',                            // 거래금액
    DractOtlt: '핀출금계좌인자',              // 출금계좌인자내용
    MractOtlt: '입금계좌인자내용'             // 입금계좌인자내용
  };

  console.debug(inputJson);
  
  const data = {'JSONData': JSON.stringify(inputJson)};
  
  const url = req.api+'?p=send&fintechApsno=001';
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data),
    url
  };

  axios(options)
  .then((response) => {
    res.json(response.data);
  }).catch((error) => {
    console.error(error);
    res.json('error');
  });
}

/**
 * Get Transfers
 * @param {string} req.body.value - fromDate.
 * @param {string} req.body.date - toDate.
 * @param res
 * @param next
 * @returns {*}
 */
function getTansfers(req, res, next) {
  var tram = req.query.value;
  var ortrYmd = req.query.date;
  var finAcno = req.query.finAccount || config.bank.nh.account;
  var ortrIsTuno = req.query.isTuno;

  var unique = getUnique();
  
  var inputJson = {
    Header: {
      ApiNm: 'CheckOnDrawingTransfer',    // API코드
      Tsymd: unique.tsymd,                // 전송일자
      Trtm: unique.trtm,                  // 전송시각
      Iscd: '000020',                     // 기관코드
      FintechApsno: '001',                // 핀테크앱일련번호
      ApiSvcCd: '01D_001_00',             // API서비스코드 
      IsTuno: unique.isTuno               // 기관거래고유번호
    },
    FinAcno: finAcno,                     // 핀-어카운트
    Tram: tram,                           // 거래금액
    OrtrYmd: ortrYmd,                     // 원거래일자
    OrtrIsTuno: ortrIsTuno                // 원거래 기관거래고유번호
  };

  console.log(inputJson);

  const data = {'JSONData': JSON.stringify(inputJson)};
  
  const url = req.api+'?p=send&fintechApsno=001';
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data),
    url
  };

  axios(options)
  .then((response) => {
    res.json(response.data);
  }).catch((error) => {
    console.error(error);
    res.json('error');
  });
}

module.exports = { getTansfers, drawTransfer};