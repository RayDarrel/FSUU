@component('mail::message')

Hello <br><h4>{{$data['name']}}</h4>,

<div class="box">
    Your Schedule will be start from {{$data['from']}} Until {{$data['end']}}.
</div>



Thanks,<br>
Father Saturnino Urios University
@endcomponent
