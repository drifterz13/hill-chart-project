export type FeatureStatus = "todo" | "in-progress" | "deploying" | "completed";
export type FeatureStage = "uphill" | "at-peak" | "downhill";

export type FeatureAssignee = {
  username: string;
  avatarUrl: string;
};

export type Feature = {
  id: string;
  name: string;
  description: string;
  status: FeatureStatus;
  stage: FeatureStage;
  percentage: number; // Progress percentage from 0 to 100
  dueDate: Date;
  createdAt: Date;
  assignees: FeatureAssignee[];
};
