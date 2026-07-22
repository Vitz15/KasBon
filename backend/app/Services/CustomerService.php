<?php

namespace App\Services;

use App\Repositories\Interfaces\CustomerRepositoryInterface;

class CustomerService
{
    protected $customerRepo;

    public function __construct(CustomerRepositoryInterface $customerRepo)
    {
        $this->customerRepo = $customerRepo;
    }

    public function getAllCustomers()
    {
        return $this->customerRepo->all();
    }

    public function getCustomerById($id)
    {
        return $this->customerRepo->find($id);
    }

    public function createCustomer(array $data)
    {
        return $this->customerRepo->create($data);
    }

    public function updateCustomer($id, array $data)
    {
        return $this->customerRepo->update($id, $data);
    }

    public function deleteCustomer($id)
    {
        return $this->customerRepo->delete($id);
    }

    public function getCustomerDebts($id)
    {
        return $this->customerRepo->getDebts($id);
    }
}