import Project from '../models/project.model.js';
import Organization from '../models/organization.model.js';
import User from '../models/user.model.js';
import activityModel from '../models/activity.model.js';

const createProject = async (req, res) => {
    try {
        const { name, description, organization } = req.body;
        if(!name || !description || !organization) {
            return res.status(400).json({status: 'error', message: 'Please provide all required fields'});
        }
        const organizationExists = await Organization.findById(organization);
        if(!organizationExists) {
            return res.status(404).json({status: 'error', message: 'Organization not found'});
        }
        const userIsMember = organizationExists.members.includes(req.user.id);
        if(!userIsMember) {
            return res.status(403).json({status: 'error', message: 'You are not a member of this organization'});
        }
        const project = await Project.create({ name, description, organization, createdBy: req.user.id });
        await activityModel.create({
            organization: organizationExists._id,
            project: project._id,
            user: req.user._id,
            action: "PROJECT_CREATED",
        });
        res.status(201).json({ status: 'success', message: 'Project created successfully', project });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getProjectsByOrganizationId = async (req, res) => {
    try {
        //user belongs to the organization
        const organizationExists = await Organization.findById(
                                        req.params.organizationId
                                    );
        if(!organizationExists) {
            return res.status(404).json({status: 'error', message: 'Organization not found'});
        }
        const userIsMember = organizationExists.members.includes(req.user.id);
        if(!userIsMember) {
            return res.status(403).json({status: 'error', message: 'You are not a member of this organization'});
        }
        const projects = await Project.find({ organization: req.params.organizationId }).populate('organization', '-members');
        res.status(200).json({ status: 'success', message: 'Projects found successfully', projects });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        //user belongs to the organization
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                status: 'error',
                message: 'Project not found'
            });
        }

        const organization = await Organization.findById(
            project.organization
        );

        if (!organization) {
            return res.status(404).json({
                status: 'error',
                message: 'Organization not found'
            });
        }

        const userIsMember = organization.members.some(
            member => member.toString() === req.user.id.toString()
        );

        if (!userIsMember) {
            return res.status(403).json({
                status: 'error',
                message: 'You are not a member of this organization'
            });
        }
        res.status(200).json({ status: 'success', message: 'Project found successfully', project });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export { createProject, getProjectsByOrganizationId, getProjectById };