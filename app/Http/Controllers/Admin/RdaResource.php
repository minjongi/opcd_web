<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Rda;
use App\Models\RdaCampaignApplicant;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\RdaListExport;
use ZipArchive;

class RdaResource extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $current_page = 1;
        $per_page = 15;
        $query = $request->query();
        
        $rdalist = Rda::query();

        if(!empty($query['page'])){
            $current_page = $query['page'];
        }

        if(!empty($query['perPage'])){
            $per_page = $query['perPage'];
        }

        if(!empty($query['campaign'])){
            $id_list = RdaCampaignApplicant::where('campaign_id', $query['campaign'])->pluck('applicant_id');
            $rdalist->whereIn('id', $id_list);
        }

        if(!empty($query['search'])){
            $rdalist->where('artist_name', 'LIKE', "%".$query['search']."%")
                     ->orWhere('song_name', 'LIKE', "%".$query['search']."%")
                     ->orWhere('email', 'LIKE', "%".$query['search']."%");
        }

        if(!empty($query['sort']) && !empty($query['sortDir'])){
            $rdalist->orderBy($query['sort'], $query['sortDir']);
        }else{
            $rdalist->orderBy('created_at', 'desc');
        }

        $total = $rdalist->count();
        $rdalist = $rdalist->offset(($current_page - 1 ) * $per_page)
                            ->limit($per_page)
                            ->get();


        return response()->json([
            'status' => 'success',
            'rdalist' => $rdalist,
            'total' => $total
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // 
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        
    }

    public function update_status(Request $request, $id)
    {
        $this->validate($request, [
            'status' => 'required|string'
        ]);

        $Rda = Rda::findOrFail($id);

        try {
            $Rda->status = $request->status;
            $Rda->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Rda updated successfully'
            ], 200);

        } catch(Exception $err) {

            return response()->json([
                'message' => 'server error'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            
            Rda::where('id', $id)->delete();
            RdaCampaignApplicant::where('applicant_id', $id)->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Rda deleted successfully'
            ], 200);

        } catch(Exception $err) {

            return response()->json([
                'message' => 'server error'
            ], 500);
        }
    }


    /**
     * Custom route.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function download_zip(Request $request)
    {   
        $ids = $request->ids;
        $rdalist = Rda::whereIn('id', $ids)->get();

        $zip = new ZipArchive();
		$filename = public_path("storage/rda.zip");

		if($zip->open($filename, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE){
			
			foreach($rdalist as $key => $rda){
				if(!empty($rda->url)){
                    $zip->addFile(public_path("storage".explode("storage", $rda->url)[1]), $rda->file_name);
				}
			}
	
			$zip->close();
		};

		if(file_exists($filename)){
			return response()->json([
                'status' => 'success',
                'filename' => '/storage/rda.zip'
            ]);
		}else{
			return response()->json([
                'status' => 'fail'
            ]);
		}
    }

    public function download_excel(Request $request)
    {   
        $ids = $request->ids;
        $filename = "rda_list.xlsx";

		return (new RdaListExport($ids))->download($filename);

        return response()->json([
            'status' => 'success',
            'id' => $ids
        ]);
    }

    public function download_file(Request $request)
    {   
        $id = $request->id;
        $rda = Rda::where('id', $id)->first();

        return Storage::download(public_path("storage".explode("storage", $rda->url)[1]));
    }
   
}
