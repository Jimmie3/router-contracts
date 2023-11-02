// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

interface IFeeManager {
    struct FeeDetail {
        address feeToken;
        address openliqReceiver;
        uint256 openliqNative;
        uint256 openLiqToken;
        uint256 integratorToken;
    }

    function getFee(
        address integrator,
        address inputToken,
        uint256 inputAmount,
        uint256 feeP
    ) external view returns (FeeDetail memory returnFee);

    function getAmountBeforeFee(
        address integrator,
        address inputToken,
        uint256 inputAmount,
        uint256 feeP
    ) external view returns (address feeToken, uint256 beforeAmount);
}
