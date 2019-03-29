<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\ContactModel;
use App\ContactMsgModel;
use App\User;
use JWTAuth;

class ContactusController extends Controller
{
	protected $user = null;
	function __construct()
	{
		$this->middleware('jwt.auth');
	}

	// get All Tickets
    public function getAllTickets( Request $request )
    {
		// user info
		$user = JWTAuth::parseToken()->authenticate();
    	$user_id = $user['id'];
    	$user_role = $user['role_id'];
    	$body = $request->all();
    	$offset_value = ($body['paginum'] - 1) * 10;

    	// response Array 
    	$response['status'] = 1;
		$response['token'] = (string)JWTAuth::getToken();

    	// get ticket data by user role
		if( $user_role == 1 )// admin
		{
			$data = ContactModel::orderBy('updated_at', 'desc')->offset($offset_value)
                        ->limit(10)
                        ->get();
            $allData = ContactModel::orderBy('updated_at', 'desc')->count();
			$response['data'] = $data;
			$response['allData'] = $allData;
		}
		else
		{
    	   	$response['data'] = ContactModel::where('user_id', $user_id)
    	   									->orderBy('updated_at', 'desc')->offset($offset_value)
                        					->limit(10)->get();
            $response['allData'] = ContactModel::where('user_id', $user_id)
    	   									->orderBy('updated_at', 'desc')->count();
		}
    	// response 
    	return response()->json($response);
    }

    // create a new ticket
    public function createTicket( Request $request )
    {
    	// get input data
    	$user = JWTAuth::parseToken()->authenticate();
    	$user_id 	= $user['id'];
    	$ticketData = $request->all();

    	// construct model class
    	$ticket = new ContactModel;
		$ticket->user_id 	= $user_id;
		$ticket->sender_name= $ticketData['sender_name'];
    	$ticket->subject 	= $ticketData['subject'];
    	$ticket->body 		= $ticketData['body'];
    	$ticket->department = $ticketData['department'];
    	$ticket->priority 	= $ticketData['priority'];
    	$ticket->state 		= 2;

		if( $ticket->save() )
		{
			$response['status'] = 1;
			$response['message'] = trans('appmessages.create_ticket_success');
			$response['ticket_id'] = $ticket->ticket_id;
		}
		else
		{
			$response['status'] = 0;
			$response['message'] = trans('appmessages.create_ticket_failed');
		}

    	return response()->json( $response );
    }

    // get full info of a ticket from ID
    public function getTicket( $id, Request $request )
    {
    	$ticket_id = $id;

    	$response['status'] = 1;
		$response['data'] 	= ContactModel::find($ticket_id);
		$data 	= ContactMsgModel::where('ticket_id', $ticket_id)->orderBy('updated_at', 'desc')->get();
		
		$response['reply'] = $data;
    	return response()->json($response);
    }

    // update ticket info
    public function updateTicket( $id, Request $request )
    {
    	$ticket_id = $id;
    	$ticketData = $request->all();
    	unset( $ticketData['token']);

		if( ContactModel::where('ticket_id', $ticket_id)->update($ticketData) )
		{
			$response['status'] = 1;
			$response['message'] = trans('appmessages.ticket_update_success');
		}
		else
		{
			$response['status'] = 0;
			$response['message'] = trans('appmessages.ticket_update_failed');
		}

    	return response()->json($response);
	}
	
	//change ticket state gjc0316
	public function ChangeTicketState( $id, Request $request )
    {
    	$ticket_id = $id;
    	$ticketData = $request->all();
    	unset( $ticketData['token']);

		if( ContactModel::where('ticket_id', $ticket_id)->update(array('state' => $ticketData['state'])) )
		{
			$response['status'] = 1;
			$response['message'] = trans('appmessages.ticket_change_state_success');
		}
		else
		{
			$response['status'] = 0;
			$response['message'] = trans('appmessages.ticket_change_state_failed');
		}

    	return response()->json($response);
    }

    // reply message
    // $id : ticket_id
    public function replyMessage( $id, Request $request )
    {
    	$user = JWTAuth::parseToken()->authenticate();
		$user_id 	= $user['id'];
    	$replyData 	= $request->all();
    	$ticket_id 	= $id;

    	// construct model class
    	$replyMsg = new ContactMsgModel;
    	$replyMsg->ticket_id 	= $ticket_id;
		$replyMsg->sender_id 	= $user_id;
		$replyMsg->sender_name  = $replyData['sender_name'];
    	$replyMsg->msg_content 	= $replyData['msg_content'];

		if( $replyMsg->save() )
		{
			$response['status'] = 1;
			$response['message'] = "Reply created successfully.";
			$response['sender_id'] = $user_id;
		}
		else
		{
			$response['status'] = 0;
			$response['message'] = "Reply failed";
		}

    	return response()->json( $response );
    }

    // temporary : delete ticket
    public function deleteTicket( $id, Request $request )
    {
    	$ticket_id = $id;

		if(ContactMsgModel::where('ticket_id', $ticket_id)->delete())
		{
			if( ContactModel::where('ticket_id', $ticket_id)->delete() )
			{
				$response['status'] = 1;
				$response['message'] = trans('appmessages.ticket_delete_success');
			}
			else
			{
				$response['status'] = 0;
				$response['message'] = trans('appmessages.ticket_delete_failed');
			}
		}
		else
		{
			$response['status'] = 0;
			$response['message'] = trans('appmessages.ticket_delete_failed');
		}

    	return response()->json($response);
    }

    public function getUnreadTicket()
    {
		// user info
		$user = JWTAuth::parseToken()->authenticate();
    	$user_id = $user['id'];
    	$user_role = $user['role_id'];

    	// response Array 
    	$response['status'] = 1;

    	// get ticket data by user role
		if( $user_role == 1 )// admin
		{
			$response['data'] = ContactModel::orderBy('updated_at', 'desc')->where('state', 2)->count();
		}
		else
		{
            $response['data'] = ContactModel::where('user_id', $user_id)->where('state', 2)->count();
		}
    	// response 
    	return response()->json($response); 	
    }
}
