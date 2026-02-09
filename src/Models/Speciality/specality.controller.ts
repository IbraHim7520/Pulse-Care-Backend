import { Request, Response } from "express";
import { specalityService } from "./specality.service";
import catchAsync from "../../shared/catchAsync";

const createSpeicalityControl = catchAsync(
  async (req: Request, res: Response) => {
    const specalityData = req.body;

    const result = await specalityService.createSpecality(specalityData);

    res.status(200).send({
      success: true,
      message: `${specalityData.title} Created Successfully.`,
      data: result,
    });
  }
);

const getSpeicalityControl = catchAsync(
  async (req: Request, res: Response) => {
    const result = await specalityService.getAllSpecality();

    res.status(200).send({
      success: true,
      message: "All Specalities Retrieved.",
      data: result,
    });
  }
);

const deleteSpeicalityControl = catchAsync(
  async (req: Request, res: Response) => {
    const specalityId = req.params.specalityId as string;

    const deletedResponse = await specalityService.deleteSpecality(specalityId);

    res.status(200).send({
      success: true,
      message: `${deletedResponse.title} Specality Deleted Successfully.`,
      data: deletedResponse,
    });
  }
);

const updateSpeicalityControl = catchAsync(
  async (req: Request, res: Response) => {
    const updatedSpecalityData = req.body;
    const specalityId = req.params.specalityId as string;

    const result = await specalityService.updateSpeciality(
      updatedSpecalityData,
      specalityId
    );

    res.status(200).send({
      success: true,
      message: `${updatedSpecalityData.title} Updated Successfully.`,
      data: result,
    });
  }
);

export const specalityController = {
  getSpeicalityControl,
  createSpeicalityControl,
  deleteSpeicalityControl,
  updateSpeicalityControl,
};
