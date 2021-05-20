<?php

use App\Models\Status;
use App\Models\Process;

if (!function_exists('update_status')) {
    /**
     *
     *
     * @param
     * @param
     * @return
     */
    function update_status($process_id, $progress, $description) {

      $status = new Status();
      $status->process_id = $process_id;
      $status->progress = $progress;
      $status->description = $description;
      $status->save();

    }
}

if (!function_exists('complete_process')) {
    /**
     *
     *
     * @param
     * @param
     * @return
     */
    function complete_process($process_id) {

      $status = new Status();
      $status->process_id = $process_id;
      $status->progress = 1;
      $status->description = 'Complete';
      $status->save();

      //Cleanup previous incomplete statuses

    }
}


?>
