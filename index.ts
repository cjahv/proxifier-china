/**
 * Created by jahv on 2017/7/1.
 */
/// <reference path="node_modules/@types/node/index.d.ts" />
import {exec} from 'child_process'
let bitpat,tmpvar;

function h_fillbitsfromleft(num)
{
    if (num >= 8 ){
        return(255);
    }
    bitpat=0xff00;
    while (num > 0){
        bitpat=bitpat >> 1;
        num--;
    }
    return(bitpat & 0xff);
}
function calcNWmask(cform)
{
    tmpvar = parseInt(cform.bits.value,10);
    if (isNaN(tmpvar) || tmpvar > 32 || tmpvar < 0){
        cform.snm_1.value = '错误';
        cform.snm_2.value="";
        cform.snm_3.value="";
        cform.snm_4.value="";
        return(1);
    }
    cform.snm_1.value=0;
    cform.snm_2.value=0;
    cform.snm_3.value=0;
    cform.snm_4.value=0;
    if (tmpvar >= 8){
        cform.snm_1.value = 255;
        tmpvar-=8;
    }else{
        cform.snm_1.value = h_fillbitsfromleft(tmpvar);
        return(0);
    }
    if (tmpvar >= 8){
        cform.snm_2.value = 255;
        tmpvar-=8;
    }else{
        cform.snm_2.value = h_fillbitsfromleft(tmpvar);
        return(0);
    }
    if (tmpvar >= 8){
        cform.snm_3.value = 255;
        tmpvar-=8;
    }else{
        cform.snm_3.value = h_fillbitsfromleft(tmpvar);
        return(0);
    }
    cform.snm_4.value = h_fillbitsfromleft(tmpvar);
    return(0);
}
function calNBFL(cform) {
    var rt=0;
    tmpvar = parseInt(cform.ip_1.value,10);
    if (isNaN(tmpvar) || tmpvar > 255 || tmpvar < 0){
        cform.numofaddr.value = '错误';
        return(1);
    }
    tmpvar = parseInt(cform.ip_2.value,10);
    if (isNaN(tmpvar) || tmpvar > 255 || tmpvar < 0){
        cform.numofaddr.value = '错误';
        return(1);
    }
    tmpvar = parseInt(cform.ip_3.value,10);
    if (isNaN(tmpvar) || tmpvar > 255 || tmpvar < 0){
        cform.numofaddr.value = '错误';
        return(1);
    }
    tmpvar = parseInt(cform.ip_4.value,10);
    if (isNaN(tmpvar) || tmpvar > 255 || tmpvar < 0){
        cform.numofaddr.value = '错误';
        return(1);
    }
    rt=calcNWmask(cform);
    if (rt !=0 ){
        // error
        return(1);
    }
    tmpvar=parseInt(cform.bits.value,10);
    if (tmpvar <0){
        cform.numofaddr.value = '错误';
        return(1);
    }
    if (tmpvar >32){
        cform.numofaddr.value = '错误';
        return(1);
    }
    if (tmpvar == 31){
        cform.numofaddr.value = "two hosts";
        cform.firstadr_1.value = cform.ip_1.value & cform.snm_1.value;
        cform.firstadr_2.value = cform.ip_2.value & cform.snm_2.value;
        cform.firstadr_3.value = cform.ip_3.value & cform.snm_3.value;
        cform.firstadr_4.value = cform.ip_4.value & cform.snm_4.value;
        //
        cform.lastadr_1.value = cform.ip_1.value | (~ cform.snm_1.value & 0xff);
        cform.lastadr_2.value = cform.ip_2.value | (~ cform.snm_2.value & 0xff);
        cform.lastadr_3.value = cform.ip_3.value | (~ cform.snm_3.value & 0xff);
        cform.lastadr_4.value = cform.ip_4.value | (~ cform.snm_4.value & 0xff);
        return(1);
    }
    if (tmpvar == 32){
        cform.numofaddr.value = "one host";
        cform.firstadr_1.value = cform.ip_1.value;
        cform.firstadr_2.value = cform.ip_2.value;
        cform.firstadr_3.value = cform.ip_3.value;
        cform.firstadr_4.value = cform.ip_4.value;
        return(1);
    }
    cform.numofaddr.value = Math.pow(2,32 - tmpvar) - 2;
    //
    cform.bcast_1.value = cform.ip_1.value | (~ cform.snm_1.value & 0xff);
    cform.bcast_2.value = cform.ip_2.value | (~ cform.snm_2.value & 0xff);
    cform.bcast_3.value = cform.ip_3.value | (~ cform.snm_3.value & 0xff);
    cform.bcast_4.value = cform.ip_4.value | (~ cform.snm_4.value & 0xff);
    //
    cform.nwadr_1.value = cform.ip_1.value & cform.snm_1.value;
    cform.nwadr_2.value = cform.ip_2.value & cform.snm_2.value;
    cform.nwadr_3.value = cform.ip_3.value & cform.snm_3.value;
    cform.nwadr_4.value = cform.ip_4.value & cform.snm_4.value;
    //
    cform.firstadr_1.value = cform.nwadr_1.value;
    cform.firstadr_2.value = cform.nwadr_2.value;
    cform.firstadr_3.value = cform.nwadr_3.value;
    cform.firstadr_4.value = parseInt(cform.nwadr_4.value) + 1;
    //
    cform.lastadr_1.value = cform.bcast_1.value;
    cform.lastadr_2.value = cform.bcast_2.value;
    cform.lastadr_3.value = cform.bcast_3.value;
    cform.lastadr_4.value = parseInt(cform.bcast_4.value) - 1;
    return(0);
}
function formattr(obj){
    return `${obj.firstadr_1.value}.${obj.firstadr_2.value}.${obj.firstadr_3.value}.${obj.firstadr_4.value}-${obj.lastadr_1.value}.${obj.lastadr_2.value}.${obj.lastadr_3.value}.${obj.lastadr_4.value}`;
}



exec(`curl -s 'http://ftp.apnic.net/apnic/stats/apnic/delegated-apnic-latest' | grep ipv4 | grep CN | awk -F\\| '{ printf("%s/%d\\n", $4, 32-log($5)/log(2)) }' `, function (err, data, sdt) {
    if (err)throw err;
    if (!data.trim()) data = sdt;
    if (!data.trim()) throw "没有数据";
    var ips = data.trim().split("\n");
    var res=[];

    for(var i in ips){
        var o=ips[i];
        var obj={
            ip_1:{value:o.split(".")[0]},
            ip_2:{value:o.split(".")[1]},
            ip_3:{value:o.split(".")[2]},
            ip_4:{value:o.split("/")[0].split(".")[3]},
            bits:{value:o.split("/")[1]},
            numofaddr:{value:""},
            snm_1:{value:""},
            snm_2:{value:""},
            snm_3:{value:""},
            snm_4:{value:""},
            nwadr_1:{value:""},
            nwadr_2:{value:""},
            nwadr_3:{value:""},
            nwadr_4:{value:""},
            firstadr_1:{value:""},
            firstadr_2:{value:""},
            firstadr_3:{value:""},
            firstadr_4:{value:""},
            lastadr_1:{value:""},
            lastadr_2:{value:""},
            lastadr_3:{value:""},
            lastadr_4:{value:""},
            bcast_1:{value:""},
            bcast_2:{value:""},
            bcast_3:{value:""},
            bcast_4:{value:""}
        };
        calNBFL(obj);
        res.push(formattr(obj));
    }
    var result=res.join("; ");
    console.log(result);
});