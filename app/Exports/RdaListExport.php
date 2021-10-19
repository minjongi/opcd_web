<?php

namespace App\Exports;

use App\Models\Rda;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class RdaListExport implements FromQuery, WithHeadings, WithMapping
{
    use Exportable;

    public function __construct(array $ids)
    {
        $this->ids = $ids;
    }

    public function query()
    {
        return Rda::query()->whereIn('id', $this->ids);
    }

    public function headings(): array
    {   
        return [
            '구분',
            '아티스트명',
            '이메일',
            '핸드폰 번호',
            '뮤직명',
            '코드',
            '파일명',
            'url'
        ];
    }

    public function map($rda): array
    {
        return [
            $rda->genre_text,
            $rda->artist_name,
            $rda->email,
            $rda->phone,
            $rda->song_name,
            $rda->code,
            $rda->file_name,
            $rda->url
        ];
    }
}
