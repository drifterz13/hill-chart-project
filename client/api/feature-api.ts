import type { Feature } from "../types/feature-types";

export class FeatureApi {
  private static headers = new Headers({
    "Content-Type": "application/json",
  });

  static async getFeatures() {
    const resp = await fetch("/api/features", {
      method: "GET",
      headers: this.headers,
    });
    return resp.json() as Promise<Feature[]>;
  }

  static async addFeature(title: string) {
    const resp = await fetch("/api/features", {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ title }),
    });
    if (!resp.ok) {
      throw new Error("Failed to add feature");
    }
    return resp;
  }
}
