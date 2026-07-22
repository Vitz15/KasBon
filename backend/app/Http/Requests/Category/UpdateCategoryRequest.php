<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $catId = $this->route('category');
        return [
            'name' => ['required', 'string', 'max:255', 'unique:categories,name,' . $catId],
            'description' => ['nullable', 'string'],
        ];
    }
}