export default {
  /**
   * Date 转换 xxxx-xx-xx 字符串
   * @param {Date} myDate 要转换的日期
   * @return {string} 日期字符串 2018-05-08
   */
  dateToFormat: myDate => {
    let yyyy = myDate.getFullYear();

    let mm = myDate.getMonth() + 1;
    let mmstring = mm < 10 ? '0' + mm : mm;

    let dd = myDate.getDate();
    let ddstring = dd < 10 ? '0' + dd : dd;

    return `${yyyy}-${mmstring}-${ddstring}`;
  },
  
  /**
   * Date 转换 20180102 字符串
   * @param {Date} myDate 要转换的日期
   * @return {string} 日期字符串 20180102
   */
  dateToYYYYmmNumber: myDate => {
    let yyyy = myDate.getFullYear();

    let mm = myDate.getMonth() + 1;
    let mmstring = mm < 10 ? '0' + mm : mm;

    let dd = myDate.getDate();
    let ddstring = dd < 10 ? '0' + dd : dd;
    
    return `${yyyy}${mmstring}${ddstring}`;
  },
  
  /**
   * Date 转换 xxxx-xx-xx xx:00 字符串
   * @param {Date} myDate 要转换的日期
   * @return {string} 日期字符串 2018-05-08 09:00
   */
  dateToYYYYmmDDhhMM00: myDate => {
    let yyyy = myDate.getFullYear();

    let mm = myDate.getMonth() + 1;
    let mmstring = mm < 10 ? '0' + mm : mm;

    let dd = myDate.getDate();
    let ddstring = dd < 10 ? '0' + dd : dd;

    let hh = myDate.getHours();
    let hhstring = hh < 10 ? '0' + hh : hh;
    
    return `${yyyy}-${mmstring}-${ddstring} ${hhstring}:00`;
  },
  
  /**
   * Date 转换 xxxx-xx-xx xx:xx 字符串
   * @param {Date} myDate 要转换的日期
   * @return {string} 日期字符串 2018-05-08 09:15
   */
  dateToYYYYmmDDhhMM: myDate => {
    let yyyy = myDate.getFullYear();

    let mm = myDate.getMonth() + 1;
    let mmstring = mm < 10 ? '0' + mm : mm;

    let dd = myDate.getDate();
    let ddstring = dd < 10 ? '0' + dd : dd;

    let hh = myDate.getHours();
    let hhstring = hh < 10 ? '0' + hh : hh;

    let Min = myDate.getMinutes();
    let Minstring = Min < 10 ? '0' + Min : Min;
    
    return `${yyyy}-${mmstring}-${ddstring} ${hhstring}:${Minstring}`;
  },
  
  /**
   * Date 转换 xxxx-xx-xx xx:xx:xx 字符串
   * @param {Date} myDate 要转换的日期
   * @return {string} 日期字符串 2018-05-08 09:15:30
   */
  dateToYYYYmmDDhhMMss: myDate => {
    let yyyy = myDate.getFullYear();

    let mm = myDate.getMonth() + 1;
    let mmstring = mm < 10 ? '0' + mm : mm;

    let dd = myDate.getDate();
    let ddstring = dd < 10 ? '0' + dd : dd;

    let hh = myDate.getHours();
    let hhstring = hh < 10 ? '0' + hh : hh;

    let Min = myDate.getMinutes();
    let Minstring = Min < 10 ? '0' + Min : Min;

    let ss = myDate.getSeconds();
    let ssstring = ss < 10 ? '0' + ss : ss;
    
    return `${yyyy}-${mmstring}-${ddstring} ${hhstring}:${Minstring}:${ssstring}`;
  }
}
