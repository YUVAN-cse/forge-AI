import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import Activity from "../models/activity.model.js";
import Attachment from "../models/attachment.model.js";
import { cloudinary, uploadToCloudinary } from "../utils/cloudinary.js";

const createAttachment = async (req, res) => {
    try {
        const { taskId } = req.body;

        if (!taskId) {
            return res.status(400).json({
                status: "error",
                message: "Task ID is required",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "File is required",
            });
        }

        const task = await Task.findById(taskId).populate({
            path: "project",
            populate: {
                path: "organization",
            },
        });

        if (!task) {
            return res.status(404).json({
                status: "error",
                message: "Task not found",
            });
        }

        const organization = task.project?.organization;

        if (!organization) {
            return res.status(404).json({
                status: "error",
                message: "Organization not found",
            });
        }

        const isOwner =
            organization.owner.toString() ===
            req.user.id.toString();

        const isMember = organization.members.some(
            (member) =>
                member.toString() === req.user.id.toString()
        );

        if (!isOwner && !isMember) {
            return res.status(403).json({
                status: "error",
                message:
                    "You are not a member of this organization",
            });
        }

        const uploadedFile = await uploadToCloudinary(
            req.file.buffer,
            `forgeai/attachments/${taskId}`,
            "auto"
        );

        const attachment = await Attachment.create({
            task: task._id,
            uploadedBy: req.user.id,
            fileName: req.file.originalname,
            fileUrl: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            publicId: uploadedFile.public_id,
        });

        await Activity.create({
            organization: organization._id,
            project: task.project._id,
            task: task._id,
            user: req.user.id,
            action: "ATTACHMENT_UPLOADED",
        });

        return res.status(201).json({
            status: "success",
            message: "Attachment uploaded successfully",
            attachment,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

const getAttachmentsByTaskId = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findById(taskId).populate({
            path: "project",
            populate: {
                path: "organization",
            },
        });

        if (!task) {
            return res.status(404).json({
                status: "error",
                message: "Task not found",
            });
        }

        const organization = task.project?.organization;

        if (!organization) {
            return res.status(404).json({
                status: "error",
                message: "Organization not found",
            });
        }

        const isOwner =
            organization.owner.toString() ===
            req.user.id.toString();

        const isMember = organization.members.some(
            (member) =>
                member.toString() === req.user.id.toString()
        );

        if (!isOwner && !isMember) {
            return res.status(403).json({
                status: "error",
                message: "Unauthorized",
            });
        }

        const attachments = await Attachment.find({
            task: taskId,
        })
            .populate("uploadedBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: "success",
            attachments,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

const deleteAttachment = async (req, res) => {
    try {
        const { attachmentId } = req.params;

        const attachment = await Attachment.findById(
            attachmentId
        ).populate({
            path: "task",
            populate: {
                path: "project",
                populate: {
                    path: "organization",
                },
            },
        });

        if (!attachment) {
            return res.status(404).json({
                status: "error",
                message: "Attachment not found",
            });
        }

        if (
            attachment.uploadedBy.toString() !==
            req.user.id.toString()
        ) {
            return res.status(403).json({
                status: "error",
                message:
                    "You are not authorized to delete this attachment",
            });
        }

        const task = attachment.task;
        const project = task.project;
        const organization = project.organization;

        if (attachment.publicId) {
            await cloudinary.uploader.destroy(
                attachment.publicId,
                {
                    resource_type: "auto",
                }
            );
        }

        await attachment.deleteOne();

        await Activity.create({
            organization: organization._id,
            project: project._id,
            task: task._id,
            user: req.user.id,
            action: "ATTACHMENT_DELETED",
        });

        return res.status(200).json({
            status: "success",
            message: "Attachment deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};



export {
    createAttachment,
    getAttachmentsByTaskId,
    deleteAttachment
}