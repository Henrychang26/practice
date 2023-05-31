import { useState } from "react";
import ApprovalService from "../services/ApprovalService";
import { contracts } from "../constants";

const useApproval = (symbol: string) => {
  const [isApproved, setIsApproved] = useState(false);
  const [isAskingPermission, setIsAskingPermission] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const checkIsApproved = async () => {
    const isApproved = await ApprovalService.isApprovedToken(
      symbol,
      contracts.SWAPROUTER.address
    );
    setIsApproved(isApproved);
  };

  const approve = async () => {
    setIsAskingPermission(true);

    await ApprovalService.approveTokens(
      symbol,
      contracts.SWAPROUTER.address,
      setIsApproving,
      setIsAskingPermission
    );

    try {
      await ApprovalService.isApprovedToken(
        symbol,
        contracts.SWAPROUTER.address
      );
      setIsApproved(true);
    } catch (e) {
      console.log(e);
    }
    // console.log(isApproved);
  };

  return {
    isApproved,
    isAskingPermission,
    isApproving,
    checkIsApproved,
    approve,
  };
};

export default useApproval;
