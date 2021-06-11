<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

use App\Models\Process;
use App\Models\Status;

class ProcessSearch implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $metadata;
    public $timeout = 3600; 



    public function __construct($metadata_file)
    {
        $this->metadata = json_decode(Storage::get($metadata_file));
    }



    public function handle()
    {
        //Create a new process
        $process = Process::find($this->metadata->process_id);
        $process->user_id = $this->metadata->user_id;
        $process->save;

        for($i = 0; $i < 10; $i++)
        {
            sleep(1);
            update_status($process->id, 0.1 * $i, 'Searching peptide 1 of x.');
        }

        complete_process($process->id);

    }
}
