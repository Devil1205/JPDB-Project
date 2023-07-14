var base = "http://api.login2explore.com:5577";
var rollno = $('#rollno');
var nam = $('#name');
var clas = $('#class');
var dob = $('#dob');
var address = $('#address');
var enroll = $('#enroll');
var save = $('#save');
var change = $('#change');
var res = $('#reset');
const validateAndGetFormData = ()=>{
    if(rollno.val()=="")
    {
        rollno.focus();
        return "";
    }
    if(nam.val()=="")
    {
        nam.focus();
        return "";
    }
    if(clas.val()=="")
    {
        clas.focus();
        return "";
    }
    if(dob.val()=="")
    {
        dob.focus();
        return "";
    }
    if(address.val()=="")
    {
        address.focus();
        return "";
    }
    if(enroll.val()=="")
    {
        enroll.focus();
        return "";
    }
    var jsonStriObj = {
        rollno: rollno.val(),
        name: nam.val(),
        class: clas.val(),
        dob: dob.val(),
        address: address.val(),
        enroll: enroll.val(),  
    }
    return JSON.stringify(jsonStriObj);
}

function reset()
{
        rollno.val("");
        nam.val("");
        clas.val("");
        dob.val("");
        address.val("");
        enroll.val("");
        rollno.prop("disabled",false)
        save.prop("disabled",true)
        change.prop("disabled",true)
        res.prop("disabled",true)
        rollno.focus();
}

function createPUTRequest(connToken, jsonObj, dbName, relName) {
    var putRequest = "{\n"
            + "\"token\" : \""
            + connToken
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"PUT\",\n"
            + "\"rel\" : \""
            + relName + "\","
            + "\"jsonStr\": \n"
            + jsonObj
            + "\n"
            + "}";
    return putRequest;
}

function executeCommand(reqString, apiEndPointUrl) {
    var url = base + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
        console.log(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}

const saveData =  ()=>{
    var jsonStr = validateAndGetFormData();
    if(jsonStr==="")
        return "";
    var purReqStr = createPUTRequest("90933006|-31949325346136001|90949652",jsonStr,"Student","Student-Rel");
    const iml = "/api/iml";
    jQuery.ajaxSetup({async:false});
    var resultObj = executeCommand(purReqStr,iml)
    jQuery.ajaxSetup({async:true});
    reset();
    rollno.focus();
}

function getRollno()
{
    var roll = rollno.val();
    var jsonStr = {
        rollno: roll

        };    
        return JSON.stringify(jsonStr);
}

function saveRecNo2LS(jsonObj)
{
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}

function CreateGET_BY_KEY_REQUEST(token, dbname, relationName, jsonObjStr, createTime, updateTime) {
    if (createTime !== undefined) {
        if (createTime !== true) {
            createTime = false;
        }
    } else {
        createTime = false;
    }
    if (updateTime !== undefined) {
        if (updateTime !== true) {
            updateTime = false;
        }
    } else {
        updateTime = false;
    }
    var value1 = "{\n"
            + "\"token\" : \""
            + token
            + "\",\n" + "\"cmd\" : \"GET_BY_KEY\",\n"
            + "\"dbName\": \""
            + dbname
            + "\",\n"
            + "\"rel\" : \""
            + relationName
            + "\",\n"
            + "\"jsonStr\":\n"
            + jsonObjStr
            + "\,"
            + "\"createTime\":"
            + createTime
            + "\,"
            + "\"updateTime\":"
            + updateTime
            + "\n"
            + "}";
    return value1;
}

function createUPDATERecordRequest(token, jsonObj, dbName, relName, recNo) {
    var req = "{\n"
            + "\"token\" : \""
            + token
            + "\","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"UPDATE\",\n"
            + "\"rel\" : \""
            + relName
            + "\",\n"
            + "\"jsonStr\":{ \""
            + recNo
            + "\":\n"
            + jsonObj
            + "\n"
            + "}}";
    return req;
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    nam.val(record.name);
    clas.val(record.class);
    dob.val(record.dob);
    address .val(record.address);
    enroll .val(record.enroll);
}

const getStudent =  ()=>{
    var rollnoJsonObj = getRollno();
    console.log(rollnoJsonObj);
    var getRequest = CreateGET_BY_KEY_REQUEST("90933006|-31949325346136001|90949652","Student","Student-Rel",rollnoJsonObj);
    const irl = "/api/irl";
    jQuery.ajaxSetup({async:false});
    var resultObj = executeCommand(getRequest,irl)
    jQuery.ajaxSetup({async:true});
    if(resultObj.status===400)
    {
        save.prop("disabled",false);
        res.prop("disabled",false);
        nam.focus();
    }
    else if(resultObj.status===200)
    {
        rollno.prop('disabled',true);
        fillData(resultObj);
        change.prop("disabled",false);
        res.prop("disabled",false);
        nam.focus();
    }
}

const changeData =  ()=>{
    change.prop('disabled',true);
    var jsonStr = validateAndGetFormData();
    var updateRequest = createUPDATERecordRequest("90933006|-31949325346136001|90949652",jsonStr,"Student","Student-Rel",localStorage.getItem('recno'));
    const iml = "/api/iml";
    jQuery.ajaxSetup({async:false});
    var resultObj = executeCommand(updateRequest,iml)
    jQuery.ajaxSetup({async:true});
    reset();
    rollno.focus();
}