import organizationModel from '../models/organization.model.js';
import userModel from '../models/user.model.js';
import activityModel from '../models/activity.model.js';

const createOrganization = async (req, res) => {
    try {
        const { name, description } = req.body;
        if(!name || !description) {
            return res.status(400).json({status: 'error', message: 'Please provide all required fields'});
        }
        const organization = await organizationModel.create({ name, description, owner: req.user.id  , members: [req.user.id] });
        res.status(201).json({ status: 'success', message: 'Organization created successfully', organization });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getOrganizations = async (req, res) => {
    try {
        const organizations =
                            await organizationModel.find({
                                $or: [
                                    { owner: req.user.id },
                                    { members: req.user.id }
                                ]
                            }).populate('members', '-password');
        res.status(200).json({ status: 'success', message: 'Organizations found successfully', organizations });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getOrganizationById = async (req, res) => {
    try {
        const organization =
        await organizationModel
            .findById(req.params.id)
            .populate('members', '-password');

        if (!organization) {
        return res.status(404).json({
            status: 'error',
            message: 'Organization not found'
        });
        }

        const isOwner =
        organization.owner.toString() ===
        req.user.id.toString();

        const isMember =
        organization.members.some(
            member =>
                member._id.toString() ===
                req.user.id.toString()
        );

        if (!isOwner && !isMember) {
        return res.status(403).json({
            status: 'error',
            message: 'You are not a member of this organization'
        });
        }
        res.status(200).json({ status: 'success', message: 'Organization found successfully', organization });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const addMemberToOrganization = async (req, res) => {
    try {
        const { email } = req.body;
        if(!email) {
            return res.status(400).json({status: 'error', message: 'Please provide all required fields'});
        }
        const organization = await organizationModel.findById(req.params.id);
        if (!organization) {
            return res.status(404).json({ status: 'error', message: 'Organization not found' });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        if (organization.members.includes(user._id)) {
            return res.status(400).json({ status: 'error', message: 'User is already a member of this organization' });
        }

        organization.members.push(user._id);
        await organization.save();
        await activityModel.create({
            organization: organization._id,
            project: null,
            task: null,
            user: user._id,
            action: "MEMBER_ADDED",
        });
        res.status(200).json({ status: 'success', message: 'Member added to organization successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const removeMemberFromOrganization = async (req, res) => {
    try {
        const { id, userId } = req.params;

        const organization =
            await organizationModel.findById(id);

        if (!organization) {
            return res.status(404).json({
                status: 'error',
                message: 'Organization not found'
            });
        }

        if (
            organization.owner.toString() !==
            req.user.id.toString()
        ) {
            return res.status(403).json({
                status: 'error',
                message:
                    'You are not authorized to remove members from this organization'
            });
        }

        if (
            organization.owner.toString() ===
            userId.toString()
        ) {
            return res.status(400).json({
                status: 'error',
                message:
                    'You cannot remove yourself from the organization'
            });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const memberIndex = organization.members.findIndex(
            member =>
                member.toString() === userId.toString()
        );

        if (memberIndex === -1) {
            return res.status(400).json({
                status: 'error',
                message:
                    'User is not a member of this organization'
            });
        }

        organization.members.splice(memberIndex, 1);

        await organization.save();

        await activityModel.create({
            organization: organization._id,
            project: null,
            task: null,
            user: user._id,
            action: "MEMBER_REMOVED",
        });

        return res.status(200).json({
            status: 'success',
            message:
                'Member removed from organization successfully'
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};


const getMembersOfOrganization = async (req, res) => {
    try {
        const organization = await organizationModel.findById(req.params.id).populate('members', '-password');
        if (!organization) {
            return res.status(404).json({ status: 'error', message: 'Organization not found' });
        }
        res.status(200).json({ status: 'success', message: 'Members found successfully', members: organization.members });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export { createOrganization, getOrganizations, getOrganizationById , addMemberToOrganization, removeMemberFromOrganization, getMembersOfOrganization};