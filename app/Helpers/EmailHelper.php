<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Log;

class EmailHelper
{

    public function sendEmail($email, $name, $password)
    {
        $subject = '[OPCD] 임시 비밀번호를 확인 해주세요! ';
        $body = '';
        $sender = "support@opcd.kr";
        $sender_name = "OPCD";
        $username = env('DIRECT_SEND_USER');
        $key = env('DIRECT_SEND_KEY'); 

        $receiver = '[{"email":"'.$email.'", "note1": "'.$password.'"}]';

        //템플릿을 사용하길 원하실 경우 아래 주석을 해제하신후, 사이트에 등록한 템플릿 번호를 입력해주시기 바랍니다.
        $template = 3;        //발송 할 템플릿 번호

        // $bodytag = '1';  //HTML이 기본값 입니다. 메일 내용을 텍스트로 보내실 경우 주석을 해제 해주시기 바랍니다.

        $postvars = '"subject":"'.$subject.'"';
        $postvars = $postvars.', "body":"'.$body.'"';
        $postvars = $postvars.', "sender":"'.$sender.'"';
        $postvars = $postvars.', "sender_name":"'.$sender_name.'"';
        $postvars = $postvars.', "username":"'.$username.'"';
        $postvars = $postvars.', "receiver":'.$receiver;

        $postvars = $postvars.', "template":"'.$template.'"';       //템플릿 사용할 경우 주석 해제

        $postvars = $postvars.', "key":"'.$key.'"';
        $postvars = '{'.$postvars.'}';

        $ch = curl_init();
        $url = "https://directsend.co.kr/index.php/api_v2/mail_change_word";
        $headers = array(
            "cache-control: no-cache",
            "content-type: application/json; charset=utf-8"
        );
        
        curl_setopt($ch,CURLOPT_URL, $url);
        curl_setopt($ch,CURLOPT_POST, true);
        curl_setopt($ch,CURLOPT_POSTFIELDS, $postvars);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch,CURLOPT_CONNECTTIMEOUT ,3);
        curl_setopt($ch,CURLOPT_TIMEOUT, 60);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec($ch);

        if(curl_errno($ch)){
            echo 'Curl error: ' . curl_error($ch);
            Log::notice($url . ' error: ' . curl_error($ch));
            return null;
        }else{
            print_R($response);
            Log::notice($url . ' response: ' . $response);
            return 'success';
        }
        
        curl_close ($ch);
    }

    public function sendRdaEmail($rda)
    {
        $subject = '[OPCD] RDA 등록정보 확인하세요. ';
        $body = '';
        $sender = "support@opcd.kr";
        $sender_name = "OPCD";
        $username = env('DIRECT_SEND_USER');
        $key = env('DIRECT_SEND_KEY'); 

        $receiver = '[{"name":"'.$rda->artist_name.'", "email":"'.$rda->email.'", "note1":"'.$rda->song_name.'", "note2": "'.$rda->genre_text.'", "note3": "'.$rda->code.'"}]';

        //템플릿을 사용하길 원하실 경우 아래 주석을 해제하신후, 사이트에 등록한 템플릿 번호를 입력해주시기 바랍니다.
        $template = 6;        //발송 할 템플릿 번호

        // $bodytag = '1';  //HTML이 기본값 입니다. 메일 내용을 텍스트로 보내실 경우 주석을 해제 해주시기 바랍니다.

        $postvars = '"subject":"'.$subject.'"';
        $postvars = $postvars.', "body":"'.$body.'"';
        $postvars = $postvars.', "sender":"'.$sender.'"';
        $postvars = $postvars.', "sender_name":"'.$sender_name.'"';
        $postvars = $postvars.', "username":"'.$username.'"';
        $postvars = $postvars.', "receiver":'.$receiver;

        $postvars = $postvars.', "template":"'.$template.'"';       //템플릿 사용할 경우 주석 해제

        $postvars = $postvars.', "key":"'.$key.'"';
        $postvars = '{'.$postvars.'}';

        $ch = curl_init();
        $url = "https://directsend.co.kr/index.php/api_v2/mail_change_word";
        $headers = array(
            "cache-control: no-cache",
            "content-type: application/json; charset=utf-8"
        );
        
        curl_setopt($ch,CURLOPT_URL, $url);
        curl_setopt($ch,CURLOPT_POST, true);
        curl_setopt($ch,CURLOPT_POSTFIELDS, $postvars);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch,CURLOPT_CONNECTTIMEOUT ,3);
        curl_setopt($ch,CURLOPT_TIMEOUT, 60);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec($ch);

        if(curl_errno($ch)){
            Log::notice($url . ' error: ' . curl_error($ch));
            return null;
        }else{
            Log::notice($url . ' response: ' . $response);
            return 'success';
        }
        
        curl_close ($ch);
    }
    
}
