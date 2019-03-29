<?php

namespace App\Services\Repositories\Eloquent;

use Illuminate\Database\Eloquent\Model;
use App\Services\Repositories\BaseRepository;

abstract class EloquentBaseRepository implements BaseRepository
{
    /**
     * @var \Illuminate\Database\Eloquent\Model An instance of the Eloquent Model
     */
    protected $model;

    /**
     * @param \Illuminate\Database\Eloquent\Model $model
     */
    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * @param int $id
     *
     * @return mixed
     */
    public function find($id)
    {
        return $this->model->query()->find($id);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all()
    {
        return $this->model->all();
    }

    /**
     * @param mixed $data
     *
     * @return mixed
     */
    public function create($data)
    {
        return $this->model->create($data);
    }

    /**
     * @param  Model $model
     * @param  array $data
     * @return mixed
     */
    public function update($model, $data)
    {
        return $model->update($data);
    }

    /**
     * @param Model $model
     *
     * @return mixed
     */
    public function destroy($model)
    {
        return $model->delete();
    }
}
