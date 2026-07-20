import organizationModel from '../models/organization.model.js';

const createOrganization = async (req, res) => {
    try {
        const { name, description } = req.body;
        if(!name || !description) {
            return res.status(400).json({status: 'error', message: 'Please provide all required fields'});
        }
        const organization = await organizationModel.create({ name, description, owner: req.user.id });
        res.status(201).json({ status: 'success', message: 'Organization created successfully', organization });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getOrganizations = async (req, res) => {
    try {
        const organizations = await organizationModel.find({ owner: req.user.id }).populate('members', '-password');
        res.status(200).json({ status: 'success', message: 'Organizations found successfully', organizations });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getOrganizationById = async (req, res) => {
    try {
        if (req.user.id !== req.params.id) {
            return res.status(401).json({ status: 'error', message: 'Forbidden' });
        }
        const organization = await organizationModel.findById(req.params.id).populate('members', '-password');
        if (!organization) {
            return res.status(404).json({ status: 'error', message: 'Organization not found' });
        }
        res.status(200).json({ status: 'success', message: 'Organization found successfully', organization });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export { createOrganization, getOrganizations, getOrganizationById };